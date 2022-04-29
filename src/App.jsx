import { useEffect, useState, useRef } from 'react';
import './App.css';
import Card from './components/Card';
import Api from './Api';

function App() {
  const [messages, setMessages] = useState([]);
  const [likedMessages, setLikedMessages] = useState(new Set([]));
  const lastMessageId = useRef(0);
  const isSorted = useRef(false);

  useEffect(() => {
    Api.getMessagesById(lastMessageId.current)
      .then((data) => {
        const { Messages } = data;
        lastMessageId.current = Messages[Messages.length - 1].id;
        setMessages(Messages);
      })
      .catch(console.log);
  }, []);
  useEffect(() => {
    if (localStorage.getItem('likedMessages')) {
      const storedLikedMessages = localStorage
        .getItem('likedMessages')
        .split(',');
      setLikedMessages(new Set(storedLikedMessages));
    }
  }, []);

  useEffect(() => {
    const updates = setInterval(() => {
      Api.getMessagesById(lastMessageId.current).then((data) => {
        if (!data.Messages) {
          return;
        }

        setMessages((mes) => {
          const newMessages = sortMessagesById([...mes, ...data.Messages]);
          lastMessageId.current = newMessages[newMessages.length - 1].id;
          if (isSorted.current) {
            return newMessages.reverse();
          } else {
            return newMessages;
          }
        });
      });
    }, 5000);
    return () => clearInterval(updates);
  }, []);

  const handleLike = (id) => {
    if (!likedMessages.has(id)) {
      setLikedMessages((s) => {
        s.add(id);
        return new Set(s);
      });
    } else {
      setLikedMessages((s) => {
        s.delete(id);
        return new Set(s);
      });
    }
    localStorage.setItem('likedMessages', Array.from(likedMessages).join(','));
  };

  const sortMessagesById = (arr) => {
    return [...arr].sort((a, b) => a.id - b.id);
  };

  return (
    <div className='App'>
      <ul className='sorter'>
        <li>
          <button
            onClick={() => {
              setMessages(sortMessagesById(messages).reverse());
              isSorted.current = true;
            }}
          >
            Сначала новые
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setMessages(sortMessagesById(messages));
              isSorted.current = false;
            }}
          >
            Сначала старые
          </button>
        </li>
      </ul>
      {messages.map((m) => (
        <Card
          key={m.id}
          {...m}
          isLiked={likedMessages.has(m.id)}
          setLike={handleLike}
        />
      ))}
    </div>
  );
}

export default App;
