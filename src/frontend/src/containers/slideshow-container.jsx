import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../reducers/slide';
import Slideshow from '../components/slideshow';

const mapStateToProps = (state) => {
  return {
    images: state.slide.images,
    curImage: state.slide.curImage,
    comments: state.slide.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addComment: bindActionCreators(Actions.addComment, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Slideshow);
