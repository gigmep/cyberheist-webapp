export async function requestStars(tg, amount) {
  return new Promise((resolve, reject) => {
    try {
      tg.openInvoice({
        slug: 'cyberheist_entry',
        amount,
        currency: 'RUB',
        description: 'Вход в рейд CyberHeist 2099',
        payload: 'raid_start'
      }, resolve, reject);
    } catch (err) {
      reject(err);
    }
  });
}