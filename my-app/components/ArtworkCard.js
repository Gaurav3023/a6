import { useState } from "react";
import useSWR from "swr";
import { Card, Button } from "react-bootstrap";
import Link from "next/link";
import Error from "next/error";

const ArtworkCard = ({ objectID }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    primaryImageSmall,
    title,
    objectDate,
    classification,
    medium,
    objectID: artworkID,
  } = data;

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Img
        variant="top"
        src={primaryImageSmall || "https://via.placeholder.com/375x375.png?text=[+Not+Available+]" }
        alt={title}
      />
      <Card.Body>
        <Card.Title>{title || "N/A"}</Card.Title>
        <Card.Text>
          <h6><b>Date:</b> {objectDate || "N/A"}</h6>
          <h6><b>Classification:</b> {classification || "N/A"}</h6>
          <h6><b>Medium:</b> {medium || "N/A"}</h6>
        </Card.Text>
        <Link href={`/artwork/${artworkID}`} passHref>
          <Button variant="outline-primary">
           ID: {artworkID}
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCard;
