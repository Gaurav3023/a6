import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { searchHistoryAtom } from '../store';
import { removeFromHistory } from '../lib/userData'; 

function History() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  if (!searchHistory) {
    return null; 
  }

  let parsedHistory = [];

  if (Array.isArray(searchHistory)) {
    searchHistory.forEach(h => {
      let params = new URLSearchParams(h);
      let entries = params.entries();
      parsedHistory.push(Object.fromEntries(entries));
    });
  }

  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation();
    try {
      await removeFromHistory(searchHistory[index]);
      setSearchHistory(current => {
        let updatedHistory = [...current];
        updatedHistory.splice(index, 1);
        return updatedHistory;
      });
    } catch (error) {
      console.error('Error removing from history:', error);
    }
  };

  const historyClicked = (e, index) => {
    e.preventDefault();
    router.push(`/artwork?${searchHistory[index]}`);
  };

  return (
    <Card>
      <h2>Search History</h2>
      <Card.Body>
        {parsedHistory.length === 0 ? (
          <Card.Text>Nothing Here. Try searching for some artwork.</Card.Text>
        ) : (
          <ListGroup>
            {parsedHistory.map((historyItem, index) => (
              <ListGroup.Item
                key={index}
                onClick={(e) => historyClicked(e, index)}
                className="historyListItem"
              >
                {Object.keys(historyItem).map(key => (
                  <span key={key}>
                    {key}: <strong>{historyItem[key]}</strong>&nbsp;
                  </span>
                ))}
                <Button
                  className="float-end"
                  variant="danger"
                  size="sm"
                  onClick={(e) => removeHistoryClicked(e, index)}
                >
                  &times;
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

export default History;
