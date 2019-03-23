import React from 'react';

function Download() {
  return (
    <div>
      <p>點擊
        <a className="text-primary" target="_blank" href="/download">
          此連結
        </a>
        下載sqlite檔
      </p>
      <p>帳號：admin</p>
      <p>密碼：同後台密碼</p>
    </div>
  );
}

export default Download;