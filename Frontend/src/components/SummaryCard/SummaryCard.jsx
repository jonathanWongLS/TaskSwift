import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';
import './SummaryCard.css';

const SummaryCard = ({cardTitle, iconSrc, value, loading}) => { 
  return (
    <Card className={`text-center ${cardTitle.toLowerCase().replace(/ /g, '-')}`}>
      <Card.Body> 
        <Row>
          <Col lg={12} xl={4} className="top-dashboard-cards-col">
            <div>
              <img width={40} height={40} src={iconSrc} />
            </div>
          </Col>
          <Col lg={12} xl={8}>
            <Card.Title>{cardTitle}</Card.Title>
            <Card.Text as="h4">
              {
                loading ? 
                <Spinner animation="grow" size="sm" />
                :
                value
              }
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

SummaryCard.propTypes = {
    cardTitle: PropTypes.string.isRequired,
    iconSrc: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default SummaryCard;
