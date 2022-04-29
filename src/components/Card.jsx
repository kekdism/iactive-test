import ArrowRightIcon from '../assets/ArrowRightIcon';
import GearIcon from '../assets/GearIcon';
import StarIcon from '../assets/StarIcon';
import WindowIcon from '../assets/WindowIcon';
import './Card.css';
import avatar from '../assets/avatar.jpg';
import { useLayoutEffect, useRef, useState } from 'react';

const Card = ({
  attachments,
  author,
  channel,
  content,
  id,
  date,
  isLiked,
  setLike,
}) => {
  const cardDate = new Date(date);
  const hours = String(cardDate.getHours()).padStart(2, '0');
  const minutes = String(cardDate.getMinutes()).padStart(2, '0');
  const textElement = useRef();
  const [isTextOverflow, setIsTextOverflow] = useState(false);
  const [expandedText, setTextExpanded] = useState(false);
  useLayoutEffect(() => {
    const { current } = textElement;
    setIsTextOverflow(current.scrollHeight > current.clientHeight);
  }, [textElement]);
  return (
    <article className='card'>
      <div className='card__wrapper'>
        <div className='card__side'>
          <img className='card__avatar' src={avatar} alt='avatar' />
          <p className='card__timestamp'>{`${hours}:${minutes}`}</p>
        </div>
        <div className='card__main'>
          <div className='card__header'>
            <div className='card__name'>
              <p className='card__nickname'>{author}</p>
              <p className='card__caption'>{channel}</p>
            </div>
            <div className='card__possition'>
              <button className='card__possition-button'>Левый</button>
              <button className='card__possition-button'>Центр</button>
              <button className='card__possition-button'>Правый</button>
            </div>
            <div className='card__icons'>
              <ArrowRightIcon />
              <WindowIcon />
              <GearIcon />
              <StarIcon
                isLiked={isLiked}
                buttonClick={setLike}
                messageId={id}
              />
            </div>
          </div>
          <div className='card__content'>
            <p
              className={`card__text ${expandedText && 'card__text_expanded'}`}
              ref={textElement}
            >
              {content}
            </p>
            {isTextOverflow && (
              <button
                type='button'
                className='card__expand'
                onClick={() => setTextExpanded((s) => !s)}
              >
                {!expandedText ? 'Далее' : 'Свернуть'}
              </button>
            )}
            {attachments && (
              <div className='card__img-container'>
                {attachments.map((att, i) => {
                  if (att.type === 'video') {
                    return (
                      <video
                        src={att.url}
                        className='card__img'
                        controls
                        key={i}
                      ></video>
                    );
                  }
                  if (att.type === 'image') {
                    return (
                      <img src={att.url} className='card__img' key={i}></img>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='card__footer'>
        <p className='card__tag card__tag_active'>#Новое</p>
        <p className='card__tag'>#Эксперт</p>
      </div>
    </article>
  );
};

export default Card;
