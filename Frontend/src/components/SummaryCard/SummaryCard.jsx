import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from 'prop-types';
import './SummaryCard.css';

const SummaryCard = ({cardTitle, iconSrc, value, darkBg}) => { 
  return (
    <Card className={`text-center ${cardTitle.toLowerCase().replace(/ /g, '-')} ${darkBg ? 'dark-bg' : ''}`}>
      <Card.Body> 
        <Row>
          <Col lg={12} xl={4} className="top-dashboard-cards-col">
            <div>
              <img width={40} height={40} src={iconSrc} />
            </div>
          </Col>
          <Col lg={12} xl={8}>
            <Card.Title>{cardTitle}</Card.Title>
            <Card.Text>
              <h4>{value}</h4>
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
    value: PropTypes.number.isRequired,
    darkBg: PropTypes.bool.isRequired,
};

export default SummaryCard;
