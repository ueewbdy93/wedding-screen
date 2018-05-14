const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let picIndex = 0;

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const urls = [
  'https://lh3.googleusercontent.com/P81GuomD1RRpvmpeyuLlyyTAMU_G3c0G1aOmK-liNBXQMta7QZXB7jkQuVGSiiTyOm5Mp8ffRGfoXkwHTHYtFO1G5NbdZ0GBT7cy_pTU0gGRECsSmvyM8EzqWrH-QXjTFWFAIxtSYTMrdyAs_WHLv3XqzZHF-lN4yi_EgqiDyiaLc4Uq3JaA_LF7KX1_regazCRFL0DYIjvvPQxQn7D5XkQZJtYvkKK91ShISBlpJoGJxfa55dQQDJbT4h2sc9q7zPPE3stxnIsinCbkr9YlsWXwNvRG-s1lKpZC5UVdvt01ts9Afg29L5CC9mMJM2JI1Sxy8mxHwlws3bXm54IKDhvnnIS04hhh37DYCWJc3o-TCn3MjO4n8Rs2ATNsa2kCFU2chdLutRJ5Z7cmgdEGO1vvdqjpBqsZRfzR-xhUSVHQFIGS6ZeuDdLrOxm78c4c4Szuc6dVUUkfnZKKBILmcm0FFlVtC3MDMBYn68cSjsKp0tR8DAbgbONCmBPnHNRKecgeT_g74uqPP8a9kivjre4vYeDSZX-qWRmhpyLSI1zdppDgvRXEVKaTuAS6eXySjJ4aiU58aOPb3u__XATxt_U9fraE0PjIQnvQ5csD1_UhL8h2lZKyVOq8KntvD6VS-GJOPdZV0r55cxB0ku9WL42kGNnqvAbS=w462-h308-no',
  'https://lh3.googleusercontent.com/CnHPT87ORfYGqUziNLUNLVNyY5s_YalNLy9hh4xm2NKbC7cZE9xGttZWtRHFMNCoh-eM0YubSQ6VOLJDF9D0lA2wVUfGW-ZNb6Be4nHCZpbjT33XSNDSe68_mLLWm6DtgksLi1VCnQ-bbqePme6ddlZ68t3LJVBkoN4Wqel_0z6C-NxGiI0kJtJ5toZ64I8xnKFHyAxQntPJl2xJ1fJ7XhtXiIVm3GYaMxpWpgZyO1paxZBwfFAgujdf1j32Y1qHKW_V_WOcMa3gu2pdsHvxBWqVYHL3y8A7ft7sZuCFLDhTRiAw_gFRvS_ctHoTFzoletzJjmMgKtdLxrP4srqm2Kp252rlpwiUYpYG9KUCWnYYnT_OhQ3y8mChBsSu7Kbib8quhwpkj19tcgmvMdPbs1og8-_3uy_clYy0ew6GJx9Yiv5cHX5Ktj0NDKtNNTSRIX6K4tazBBEQv2tfzff0-tdxbE4XJdWovkaQ9Wo6t8rp4-NliWWUO_kRgPsdVqt5CxtULo_2XI_rPjk4HbYY_a46wxJkeS4OcSQVbdVByaBwPEq8_PP3aOLSOoJI3q1mO3CIG2rpR50yfj9Mbv5HOCJBTqV5Sh0URU6ku4Tbd8idUjniltXL_cZOBR6PLTo3aUxlTA7LF4NLpwYZc7QvngibV4UGc9qC=w566-h377-no',
  'https://lh3.googleusercontent.com/cmWGmOOvpBk0xSzHh4R0D5HF8wGR7glhe_SeEx343P4XtqwEmO4uxnvfv1RJqGizouQm-CbVYhZwOav-xG4ZL2G9XI3fygFDYa_UgdAt7oZY0A_n-qWCEP4w3n6euUsYyFGY1D_VAvrLwazI3ZBCNiIG0IqbL9fLWaJNi9SLiToEAxu3ivejLmzqvkDcXiNu-lS6vOUEolg6F2GcXTf6lYSzMOedbKOUZxjKCEyoKUCVuqSCIbL-V1RjpxkXlEWdQr3z-N0E5EKi1Zw9uMRhnlE-T4WzutbV5YT8L-jfD52omfkeNNT3IzaFFEgqOejYoX8ktmDfAjNHgrAIYGkOC5WrcCGRkbIM8hLvRIaKPK4SoIOEUQqepjAMnyDjIfnrLSv-bo_6lx7PlkqP8sy4h20DKfdugqLrljI8n7CJFTjszTOsIXo11cOUgpzOZPWphgkuleFAbUxENrEUeTx69NT0PYQqgZPbrB858sHZj-f8ZB_a_1Ku_4dK3x5XSrSkR6eijxTIL8jISu4M_AQ2oXnyxJCBRzzUuDO1n2UW1Q29k1D5MiYjiorMKBekZNNXAjWH6lLQvkJvKeF0ud1pK2O0lCivHgPeNiujx-GRg8uRjdg5GfSR7oPl_u7S9_N9Yr6x1mFh4MhZKIQUS1ggABJgxpMJf3Yr=w1772-h1181-no'
];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('action', { type: 'INIT_DONE', data: { picUrls: urls, showPicIndex: 0 } });

  const timeoutHandler = (count) => {
    socket.emit('action', { type: 'NEXT_PIC', data: { showPicIndex: count } });
    setTimeout(timeoutHandler, 5000, (count + 1) % 3);
  }

  setTimeout(timeoutHandler, 1000, 0);

  socket.on('error', (err) => {
    console.error(err);
  })
});

io.on('error', (err) => {
  console.error(err);
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
  }
  next();
});

