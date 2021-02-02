import React from 'react';
import userChatIcon from '../../assets/img/user-icon.png';

import Viewer from 'react-viewer';

const ImageMessage = ({ msg, images }) => {
  const [visible, setVisible] = React.useState(false);
  const [selectedImageIndex, setActiveIndex] = React.useState(0);

  const selectImage = (src) => {
    const index = images.findIndex(img => img.src === src);
    setActiveIndex(index);
  };
  return (
    <>
      {msg.isSender === true ? (
        <div className='message right'>
          <img alt='' src={userChatIcon} />
          <div className='bubble'>
            <div className='card' style={{ width: '10rem' }}>
              <img
                src={msg.src}
                onClick={() => {
                  setVisible(true);
                  selectImage(msg.src);
                }}
                alt='Card cap'
              />
            </div>
            {msg.uploadStaus && msg.uploadStaus.uploadInProgress && (
              <div className='progress mt-1'>
                <div
                  className='progress-bar'
                  role='progressbar'
                  style={{ width: `${msg.uploadStaus.percentage}%` }}
                  aria-valuenow='25'
                  aria-valuemin='0'
                  aria-valuemax='100'
                >
                  {msg.uploadStaus.percentage} %
                </div>
              </div>
            )}
            <div className='corner'></div>
            <span> {msg.formattedDate} </span>
          </div>
          <Viewer
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            images={images}
            activeIndex={selectedImageIndex}
          />
        </div>
      ) : (
        <div className='message'>
          <img alt='' src={userChatIcon} />
          <div className='bubble'>
            <div className='contact-name'> {msg.senderName} </div>
            <div className='card left-card' style={{ width: '10rem' }}>
              <img
                src={msg.src}
                onClick={() => {
                  selectImage(msg.src);
                  setVisible(true);
                }}
                alt='Card cap'
              />
            </div>

            <div className='corner'></div>
            <span> {msg.formattedDate} </span>
          </div>
          <Viewer
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            images={images}
            changeable={false}
            activeIndex={selectedImageIndex}
          />
        </div>
      )}
    </>
  );
};

export default ImageMessage;
