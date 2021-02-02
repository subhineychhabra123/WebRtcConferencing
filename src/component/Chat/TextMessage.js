import React from 'react';
import userChatIcon from '../../assets/img/user-icon.png';

const TextMessage = ({ msg }) => {
  return (
    <>
      {msg.isSender === true ? (
        <div className='message right'>
          <img alt='' src={userChatIcon} />
          <div className='bubble'>
            {msg.messageText}
            <div className='corner'></div>
            <span> {msg.formattedDate} </span>
          </div>
        </div>
      ) : (
        <div className='message'>
          <img alt='' src={userChatIcon} />
          <div className='bubble'>
            <div className='contact-name'> {msg.senderName} </div>
            {msg.messageText}
            <div className='corner'></div>
            <span>{msg.formattedDate}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TextMessage;
