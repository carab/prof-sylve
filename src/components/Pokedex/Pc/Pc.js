'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactSwipe from 'react-swipe';
import {injectIntl, defineMessages} from 'react-intl';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import NavigateBeforeIcon from 'material-ui/svg-icons/image/navigate-before';
import NavigateNextIcon from 'material-ui/svg-icons/image/navigate-next';

import PokedexBox from 'components/Pokedex/Box/Box';
import PokedexToolbar from 'components/Pokedex/Toolbar/Toolbar';

import actions from 'actions';

import './Pc.css';

const messages = defineMessages({
  previousBox: {id: 'pokemon.toolbar.previousBox'},
  nextBox: {id: 'pokemon.toolbar.nextBox'},
});

export const BOX_COLS = 6;
export const BOX_ROWS = 5;
export const BOX_SIZE = BOX_COLS * BOX_ROWS;

class PokemonPc extends Component {
  constructor(props) {
    super(props);

    this.handleSelectBox = this.handleSelectBox.bind(this);
    this.handlePreviousBox = this.handlePreviousBox.bind(this);
    this.handleNextBox = this.handleNextBox.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);

    this.state = {
      boxes: [],
    };
  }

  componentWillMount() {
    const {pokemons, params, setCurrentBox} = this.props;
    const currentBox = parseInt(params.currentBox) || this.props.currentBox;

    if (currentBox !== this.props.currentBox) {
      setCurrentBox(currentBox);
    }

    const boxes = [];
    let box = null;

    _.each(pokemons, (pokemon) => {
      if (null === box) {
        box = {
          index: boxes.length,
          ids: [],
          count: 0,
          start: pokemon.id,
        };

        boxes.push(box);
      }

      box.ids.push(pokemon.id);
      box.count++;

      if (box.count === BOX_SIZE) {
        box.end = pokemon.id;
        box = null;
      }
    });

    this.setState({
      boxes,
      currentBox,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.params.currentBox !== this.props.currentBox) {
      this.handleSelectBox(undefined, nextProps.params.currentBox);
    }

    return false;
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {boxes, currentBox} = this.state;

    return (
      <div className="PokemonPc container">
        <Paper zDepth={1} className="PokemonPc__paper">
          <PokedexToolbar boxes={boxes} onSelectBox={this.handleSelectBox}/>
          <div className="PokemonPc__view">
            <div className="PokemonPc__previousBox">
              <IconButton onClick={this.handlePreviousBox} tooltip={formatMessage(messages.previousBox)}>
                <NavigateBeforeIcon/>
              </IconButton>
            </div>
            <div className="PokemonPc__boxes">
              <ReactSwipe ref="swipe" swipeOptions={{continuous: false, startSlide: currentBox, transitionEnd: this.handleSwipe}}>
                {_.map(boxes, (box, i) => (
                  <div key={i}>
                    <PokedexBox box={box} cols={BOX_COLS}/>
                  </div>
                ))}
              </ReactSwipe>
            </div>
            <div className="PokemonPc__nextBox">
              <IconButton onClick={this.handleNextBox} tooltip={formatMessage(messages.nextBox)}>
                <NavigateNextIcon/>
              </IconButton>
            </div>
          </div>
        </Paper>
      </div>
    );
  }

  handleSwipe(currentBox) {
    this.context.router.push(`/pokedex/${this.props.currentUsername}/pc/${currentBox}`);
    this.props.setCurrentBox(currentBox);
  }

  handleSelectBox(event, index) {
    this.refs.swipe.slide(index, 300);
  }

  handlePreviousBox() {
    this.refs.swipe.prev();
  }

  handleNextBox() {
    this.refs.swipe.next();
  }
}

PokemonPc.displayName = 'PokemonPcComponent';
PokemonPc.propTypes = {};
PokemonPc.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

const mapStateToProps = (state) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    currentBox: state.ui.currentBox,
    pokemons: currentPokedex.pokemons,
    currentUsername: state.ui.currentUsername,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentBox(currentBox) {
      dispatch(actions.ui.setCurrentBox(currentBox));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonPc));