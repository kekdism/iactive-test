class Api {
  constructor() {
    this.url = 'http://f0665380.xsph.ru/';

    this.mandatoryFields = { 'actionName': 'MessagesLoad' };
  }

  async getMessagesById(id = 0) {
    try {
      const formData = new FormData();
      Object.entries(this.mandatoryFields).forEach(([key, value]) => formData.append(key, value));
      formData.append('messageId', `${id}`);
      const res = await fetch(this.url, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }

  }
}

export default new Api();
