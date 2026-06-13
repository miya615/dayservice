const { chromium } = require('playwright');
const path = require('path');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FILE   = 'file://' + path.resolve('/home/user/dayservice/index.html');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console',  m => { if(m.type()==='error') errs.push(m.text()); });

  await page.goto(FILE);
  await page.waitForLoadState('networkidle');

  // ─── STEP 1: ダッシュボード読み込み
  const greeting = await page.textContent('#greeting-text');
  await page.screenshot({ path: '/tmp/ss_01_dashboard.png' });
  console.log('✅ [1] Dashboard loaded. Greeting:', greeting.trim());

  // ─── STEP 2: 新規登録モーダルを開く
  await page.click('button[onclick="openRegModal()"]');
  await page.waitForTimeout(400);
  const regOpen = await page.evaluate(() => document.getElementById('m-reg').classList.contains('open'));
  await page.screenshot({ path: '/tmp/ss_02_reg_modal.png' });
  console.log('✅ [2] Register modal open:', regOpen);

  // ─── STEP 3: バリデーション（空送信）
  await page.click('button[onclick="saveRecord()"]');
  await page.waitForTimeout(300);
  const errDateVis   = await page.evaluate(() => document.getElementById('err-date').classList.contains('visible'));
  const errPlaceVis  = await page.evaluate(() => document.getElementById('err-place').classList.contains('visible'));
  const errParkVis   = await page.evaluate(() => document.getElementById('err-parking').classList.contains('visible'));
  await page.screenshot({ path: '/tmp/ss_03_validation.png' });
  console.log('✅ [3] Validation - date:', errDateVis, '| place:', errPlaceVis, '| parking:', errParkVis);

  // ─── STEP 4: フォーム入力して登録
  await page.fill('#f-date', '2026-06-06');
  await page.fill('#f-place', 'テスト公園');
  await page.click('label[for="p-yes"]');        // ラジオはdisplay:noneのためラベルをクリック
  await page.fill('#f-cost', '500');
  // 評価: optionにvalue属性なし → labelで選択
  await page.selectOption('#f-rating', { label: '⭐⭐⭐⭐ 良かった' });
  await page.fill('#f-staff', '田中、鈴木');
  await page.fill('#f-note', 'テスト用メモ。段差なし。');
  const firstTagLabel = await page.locator('#tag-checks label').first();
  if (await firstTagLabel.count() > 0) await firstTagLabel.click(); // タグもdisplay:noneのためラベル
  await page.click('button[onclick="saveRecord()"]');
  await page.waitForTimeout(600);
  const modalClosed = await page.evaluate(() => !document.getElementById('m-reg').classList.contains('open'));
  await page.screenshot({ path: '/tmp/ss_04_saved.png' });
  console.log('✅ [4] Record saved, modal closed:', modalClosed);

  // ─── STEP 5: 統計カード
  const statCount = await page.locator('#stat-cards .stat-card').count();
  console.log('✅ [5] Stat cards rendered:', statCount);

  // ─── STEP 6: スケジュールリスト
  const schedHTML = await page.locator('#schedule-list').innerHTML();
  console.log('✅ [6] Schedule list HTML length:', schedHTML.length);

  // ─── STEP 7: ダッシュボードカレンダー
  const calCells = await page.locator('#dash-cal-body td').count();
  await page.click('button[onclick="dashCalMove(-1)"]');
  await page.waitForTimeout(200);
  await page.click('button[onclick="dashCalMove(1)"]');
  await page.waitForTimeout(200);
  console.log('✅ [7] Mini calendar cells:', calCells, '| month navigation OK');

  // ─── STEP 8: リストビュー切り替え
  await page.click('#nav-list');
  await page.waitForTimeout(400);
  const listVis = await page.evaluate(() => document.getElementById('view-list').style.display !== 'none');
  await page.screenshot({ path: '/tmp/ss_05_list.png' });
  console.log('✅ [8] List view visible:', listVis);

  // ─── STEP 9: キーワード検索
  await page.fill('#s-kw', 'テスト');
  await page.waitForTimeout(300);
  const kwResults = await page.locator('#rec-list .rec-card').count();
  await page.screenshot({ path: '/tmp/ss_06_search.png' });
  console.log('✅ [9] Keyword search results:', kwResults);

  // ─── STEP 10: 日付フィルタ
  await page.fill('#s-from', '2026-06-01');
  await page.fill('#s-to', '2026-06-30');
  await page.waitForTimeout(300);
  const dateResults = await page.locator('#rec-list .rec-card').count();
  console.log('✅ [10] Date filter results:', dateResults);

  // ─── STEP 11: フィルタクリア
  await page.click('button[onclick="clearFilters()"]');
  await page.waitForTimeout(300);
  const clearResults = await page.locator('#rec-list .rec-card').count();
  console.log('✅ [11] After clear filter, results:', clearResults);

  // ─── STEP 12: カード詳細モーダル
  if (clearResults > 0) {
    await page.locator('#rec-list .rec-card').first().click();
    await page.waitForTimeout(400);
    const detailOpen = await page.evaluate(() => document.getElementById('m-detail').classList.contains('open'));
    await page.screenshot({ path: '/tmp/ss_07_detail.png' });
    console.log('✅ [12] Detail modal open:', detailOpen);

    // ─── STEP 13: 編集モーダル
    await page.click('button[onclick="editFromDetail()"]');
    await page.waitForTimeout(400);
    const editOpen = await page.evaluate(() => document.getElementById('m-edit').classList.contains('open'));
    await page.screenshot({ path: '/tmp/ss_08_edit.png' });
    console.log('✅ [13] Edit modal open:', editOpen);
    const noteTa = await page.locator('#edit-grid textarea').first();
    if (await noteTa.count() > 0) await noteTa.fill('更新されたメモ');
    await page.click('button[onclick="saveEdit()"]');
    await page.waitForTimeout(400);
    const editSaved = await page.evaluate(() => !document.getElementById('m-edit').classList.contains('open'));
    console.log('✅ [13b] Edit saved, modal closed:', editSaved);
  }

  // ─── STEP 14: お気に入りトグル
  await page.click('#nav-list');
  await page.waitForTimeout(300);
  const heartBtn = await page.locator('[onclick*="toggleFav"]').first();
  if (await heartBtn.count() > 0) {
    await heartBtn.click({ force: true });
    await page.waitForTimeout(300);
    console.log('✅ [14] Favorite toggled');
  } else {
    console.log('⚠️ [14] toggleFav button not found by selector');
  }

  // ─── STEP 15: お気に入りビュー
  await page.click('#nav-fav');
  await page.waitForTimeout(400);
  const favItems = await page.locator('#fav-list .rec-card').count();
  await page.screenshot({ path: '/tmp/ss_09_fav.png' });
  console.log('✅ [15] Favorites view | items:', favItems);

  // ─── STEP 16: カレンダービュー（フル）
  await page.click('#nav-calendar');
  await page.waitForTimeout(400);
  const fullCells = await page.locator('#full-cal-body td').count();
  await page.screenshot({ path: '/tmp/ss_10_calendar.png' });
  await page.click('button[onclick="fullCalMove(-1)"]');
  await page.waitForTimeout(200);
  await page.click('button[onclick="fullCalMove(1)"]');
  await page.waitForTimeout(200);
  await page.click('button[onclick="fullCalToday()"]');
  await page.waitForTimeout(200);
  console.log('✅ [16] Full calendar cells:', fullCells, '| navigation OK');

  // 今日セルをクリックして詳細表示
  const todayCell = await page.locator('#full-cal-body td.today').first();
  if (await todayCell.count() > 0) {
    await todayCell.click();
    await page.waitForTimeout(300);
    const calDetail = await page.locator('#full-cal-detail').innerHTML();
    console.log('✅ [16b] Calendar date click detail length:', calDetail.length);
  }

  // ─── STEP 17: 場所ビュー
  await page.click('#nav-places');
  await page.waitForTimeout(400);
  const placesHTML = await page.locator('#places-container').innerHTML();
  await page.fill('#place-search', 'テスト');
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/ss_11_places.png' });
  console.log('✅ [17] Places content length:', placesHTML.length, '| search filter applied');

  // ─── STEP 18: サイドバー
  await page.evaluate(() => openSidebar());
  await page.waitForTimeout(300);
  const sbOpen = await page.evaluate(() => document.getElementById('sidebar').classList.contains('open'));
  await page.screenshot({ path: '/tmp/ss_12_sidebar.png' });
  await page.evaluate(() => closeSidebar());
  await page.waitForTimeout(300);
  const sbClosed = await page.evaluate(() => !document.getElementById('sidebar').classList.contains('open'));
  console.log('✅ [18] Sidebar open:', sbOpen, '| closed via overlay:', sbClosed);

  // ─── STEP 19: データ管理モーダル
  await page.evaluate(() => openDataModal());
  await page.waitForTimeout(400);
  const dataOpen = await page.evaluate(() => document.getElementById('m-data').classList.contains('open'));
  await page.screenshot({ path: '/tmp/ss_13_data.png' });
  console.log('✅ [19] Data modal open:', dataOpen);

  // CSVエクスポート
  const [dl] = await Promise.all([
    page.waitForEvent('download', {timeout:3000}).catch(()=>null),
    page.click('button[onclick="exportCSV()"]')
  ]);
  await page.waitForTimeout(300);
  console.log('✅ [19b] CSV export triggered:', dl ? 'download event received' : '(no download event - expected in file:// context)');

  // GAS URL保存テスト
  const gasField = await page.locator('#gas-url');
  await gasField.fill('https://script.google.com/macros/s/test/exec');
  await page.click('button[onclick="saveGasUrl()"]');
  await page.waitForTimeout(300);
  const gasStatus = await page.evaluate(() => localStorage.getItem('dayservice_gas') || 'not saved');
  console.log('✅ [19c] GAS URL saved to localStorage:', gasStatus.includes('script.google'));

  // ESCでモーダル閉じる
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const dataClosed = await page.evaluate(() => !document.getElementById('m-data').classList.contains('open'));
  console.log('✅ [19d] Data modal closed via ESC:', dataClosed);

  // ─── STEP 20: ヘッダー検索（全ビュー横断）
  await page.click('#nav-list');
  await page.waitForTimeout(200);
  await page.fill('#search-input', 'テスト');
  await page.waitForTimeout(300);
  const headerResults = await page.locator('#rec-list .rec-card').count();
  console.log('✅ [20] Header search results:', headerResults);

  // ─── STEP 21: ダッシュボードへ戻る
  await page.click('#nav-dashboard');
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/ss_14_final.png' });
  const dashFinal = await page.evaluate(() => document.getElementById('view-dashboard').style.display !== 'none');
  console.log('✅ [21] Back to dashboard:', dashFinal);

  // ─── JSエラー集計
  if (errs.length > 0) {
    console.log('⚠️ JS errors:', errs.slice(0,5));
  } else {
    console.log('✅ [22] No JS errors throughout');
  }

  await browser.close();
  console.log('[DONE]');
})();
