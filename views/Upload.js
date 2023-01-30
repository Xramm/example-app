import {Card} from '@rneui/themed';
import PropTypes from 'prop-types';

const Upload = ({navigation}) => {
  console.log('Starting example-app.');
  return (
    <Card>
      <Card.Image />
    </Card>
  );
};

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
