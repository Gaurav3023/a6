import { useState, useEffect } from 'react';
import useSWR from "swr";
import { Card, Button } from "react-bootstrap";
import { useAtom } from 'jotai'; 
import { favouritesAtom } from '../store'; 
import { addToFavourites, removeFromFavourites } from "../lib/userData";

const ArtworkCardDetail = ({ objectID }) => {
  const { data, error } = useSWR(
    objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null
  );

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom); 
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID))
  }, [favouritesList, objectID]);

  const favouritesClicked = async () => {
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(objectID)); 
    } else {
      setFavouritesList(await addToFavourites(objectID)); 
    }
  };

  if (error) {
    return <p>Error fetching artwork details</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const {
    primaryImage,
    title,
    objectDate,
    classification,
    medium,
    artistDisplayName,
    artistWikidata_URL,
    creditLine,
    dimensions,
  } = data;

  return (
    <Card>
      {primaryImage && <Card.Img variant="top" src={primaryImage} alt={title} />}
      <Card.Body>
        <Card.Title>{title || "N/A"}</Card.Title>
        <Card.Text>
          <h6><b>Date:</b> {objectDate || "N/A"}</h6>
          <h6><b>Classification:</b> {classification || "N/A"}</h6>
          <h6><b>Medium:</b> {medium || "N/A"}</h6>
          <br />
          {artistDisplayName && artistWikidata_URL ? (
            <>
              <b>Artist:</b> {artistDisplayName}
              <a href={artistWikidata_URL} target="_blank" rel="noreferrer">(wiki)</a><br />
            </>
          ) : (
            <>
              <b>Artist:</b> N/A<br />
            </>
          )}

          <b>Credit Line:</b> {creditLine || "N/A"}<br />
          <b>Dimensions:</b> {dimensions || "N/A"}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button variant={showAdded ? "primary" : "outline-primary"} onClick={favouritesClicked}>
          {showAdded ? "+ Favourite (added)" : "+ Favourite"}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default ArtworkCardDetail;
