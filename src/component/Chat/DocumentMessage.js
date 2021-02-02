import React from 'react';
import { useDispatch } from 'react-redux';

import userChatIcon from '../../assets/img/user-icon.png';
import { downloadGroupAttachment, downloadPrivateAttachment } from '../../service/chatService';
import supportedDocsExtensions from '../../utils/supportedDocsExtensions';

const DocumentMessage = ({ msg, meetingId }) => {
  const dispatch = useDispatch();
  const getFileExtension = (fileName) => {
    const lastOccuringIndex = fileName.lastIndexOf('.') + 1;
    return fileName.slice(lastOccuringIndex);
  };

  const getFileIcon = (fileName) => {
    const fileExtension = getFileExtension(fileName);
    return supportedDocsExtensions.find((x) => x.extensionType === fileExtension)
      ? supportedDocsExtensions.find((x) => x.extensionType === fileExtension).icon
      : supportedDocsExtensions.find((x) => x.extensionType === 'unknown').icon;
  };

  const isfileFormatKnown = (fileFormat) => {
    return supportedDocsExtensions.find((x) => x.extensionType === fileFormat);
  }
  
  const downloadAttachmentFile = (meetingId, fileName) => {
    if (!msg.threadId) {
      dispatch(downloadGroupAttachment(meetingId, fileName));
    } else {
      dispatch(downloadPrivateAttachment(meetingId, fileName, msg.threadId));
    }
  };
  return (
    <>
      {msg.isSender === true ? (
        <div className='message right'>
          <img alt='' src={userChatIcon} />
          <div className='bubble'>
            <div className="row">
            <div className='col-12 text-dark font-weight-bold'><b style={{wordBreak:'break-word'}}>{msg.fileName.split('_')[1]}</b></div>
              
                <img className='col-4' alt='' src={getFileIcon(msg.fileName)}/> 
              
              <div className='col-8'>
                <h6 className='mt-3 ml-4'>{isfileFormatKnown(getFileExtension(msg.fileName))?getFileExtension(msg.fileName).toUpperCase()+ ' file':'Unknown File type'}</h6>
              </div>
            </div>
            {(msg.uploadStaus && !msg.uploadStaus.uploadInProgress) ||
              (!msg.uploadStaus && (
                <div className='col-12 mt-2 text-center'>
                  <hr />
                <a
                      className='text-center text-dark'
                      href="javascript:void(0)"
                      onClick={() => downloadAttachmentFile(meetingId, msg.fileName, msg.threadId)}
                    ><b>Download</b></a>
                </div>
              ))}

            {msg.uploadStaus && !msg.uploadStaus.uploadInProgress && (
              <div className='col-12 mt-2 text-center'>
               <hr />
               <a
               href="javascript:void(0)"
                      className='text-center text-dark'
                      onClick={() => downloadAttachmentFile(meetingId, msg.fileName, msg.threadId)}
                    ><b>Download</b></a>
               
              </div>
            )}

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
        </div>
      ) : (
        <div className='message'>
          <img alt='' src={userChatIcon} />
          <div className='bubble'>
            <div className='contact-name '> {msg.senderName} </div>
            <div className="row">
            <div className='col-12 text-dark font-weight-bold'><b style={{wordBreak:'break-word'}}>{msg.fileName.split('_')[1]}</b></div>
              <div className='col-4 '>
                <img className='ml-1'  alt='' src={getFileIcon(msg.fileName)}/> 
                </div>
              <div className='col-8'>
              <p className='mt-3 ml-1'>{isfileFormatKnown(getFileExtension(msg.fileName))?getFileExtension(msg.fileName).toUpperCase()+ ' file':'Unknown File type'}</p>
              </div>
            </div>
            {(msg.uploadStaus && !msg.uploadStaus.uploadInProgress) ||
              (!msg.uploadStaus && (
                <div className='col-12 mt-2 text-center'>
                 <hr />
                    <a
                    href="javascript:void(0)"
                      className='text-center text-dark'
                      onClick={() => downloadAttachmentFile(meetingId, msg.fileName, msg.threadId)}
                    ><b>Download</b></a>
                 
                </div>
              ))}

            {msg.uploadStaus && !msg.uploadStaus.uploadInProgress && (
              <div className='col-12 mt-2 text-center'>
                <hr />
                <a
                href="javascript:void(0)"
                      className='text-center text-dark'
                      onClick={() => downloadAttachmentFile(meetingId, msg.fileName, msg.threadId)}
                    ><b>Download</b></a>
                
              </div>
            )}

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
            <span>{msg.formattedDate}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentMessage;
