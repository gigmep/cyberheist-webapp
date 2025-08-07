export async function requestStars(tg, amount) {
  if (!tg?.openInvoice) return; // в браузере вне Telegram — тихо пропускаем
  return new Promise((resolve, reject) => {
    try {
      tg.openInvoice(
        {
          slug: 'cyberheist_entry',
          amount,
          currency: 'RUB',
          description: 'Вход в рейд CyberHeist 2099',
          payload: 'raid_start'
        },
        resolve,
        reject
      );
    } catch (err) {
      reject(err);
    }
  });
}
