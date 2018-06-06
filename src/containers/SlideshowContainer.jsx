import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from '../reducers/slide';
import Slideshow from '../components/slideshow';

const mapStateToProps = (state) => {
  return {
    pictures: state.slide.pictures,
    index: state.slide.index,
    newComment: state.slide.newComment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addComment: bindActionCreators(Actions.addComment, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Slideshow);
