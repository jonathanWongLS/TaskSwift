import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";
import './AlertBox.css';

const AlertBox = ({ errorMessage }) => {
  return (
    <>
      <div className={ errorMessage ? `alert-container` : `alert-container-hidden`}>
        <Alert className='alert-inner' dismissible variant="danger">{ errorMessage }</Alert>
      </div>
    </>
  )
}

AlertBox.propTypes = {
      errorMessage: PropTypes.string,
};

export default AlertBox;