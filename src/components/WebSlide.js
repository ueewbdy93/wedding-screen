import React from 'react';
import Slider from 'react-slick';
import PropTypes from 'prop-types';

class WebSlide extends React.Component {
  constructor(props) {
    super(props);
    this.refHandler = this.refHandler.bind(this);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.imageIndex !== this.props.imageIndex && this.ref) {
      this.ref.slickGoTo(nextProps.imageIndex);
    }
  }

  setRef(ref) {
    this.ref = ref;
    // console.log(ref);
  }

  /**
   * @param {HTMLDivElement} ref
   */
  refHandler(ref) {
    this.rrr = ref;
    console.log('aaa', ref.offsetWidth);
  }

  render() {
    const { images, bulletComments } = this.props;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      // accessibility: false,
      // arrows: true,
      // dots: false,
      // draggable: false,
      // fade: true,
      // pauseOnHover: false,
      // infinite: true,
      // speed: 500,
      // slidesToShow: 1,
      // slidesToScroll: 1,
    };
    return (
      <div ref={this.refHandler} style={{ overflow: 'hidden' }}>
        <Slider {...settings} ref={ref => this.setRef(ref)}>
          {images.map(image => <div key={image}><img style={{ margin: 'auto', minHeight: '800px' }} alt={image} src={image} /></div>)}
        </Slider>
        {bulletComments.map(bulletComment => (
          <h1 style={{
            width: 'fit-content', position: 'fixed', left: bulletComment.x, top: bulletComment.y,
}}
          >
            {bulletComment.comment}
          </h1>
        ))}
      </div>
    );
  }
}

WebSlide.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageIndex: PropTypes.number.isRequired,
  bulletComments: PropTypes.arrayOf(PropTypes.shape({
    user: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    y: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
  })).isRequired,
};

export default WebSlide;
