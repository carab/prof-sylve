'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import DocumentTitle from 'react-document-title';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import MoreVertIconIcon from 'material-ui/svg-icons/navigation/more-vert';
import PowerSettingsNewIcon from 'material-ui/svg-icons/action/power-settings-new';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ListIcon from 'material-ui/svg-icons/action/list';
import ViewModuleIcon from 'material-ui/svg-icons/action/view-module';
import BugReportIcon from 'material-ui/svg-icons/action/bug-report';
import LanguageIcon from 'material-ui/svg-icons/action/language';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import actions from '../actions';

import 'flexboxgrid/dist/flexboxgrid.css';
import 'styles/App.css';

const messages = defineMessages({
  app: {id: 'app'},
  byBox: {id: 'nav.byBox'},
  byList: {id: 'nav.byList'},
  bugs: {id: 'nav.bugs'},
  settings: {id: 'user.settings'},
  signout: {id: 'user.signout'},
});

const styles = {
  appbar: {
    position: 'fixed',
    zIndex: 1301,
  },
  nav: {
    paddingTop: '64px',
  },
};

const muiTheme = getMuiTheme();

class AppComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleToggleNav = this.handleToggleNav.bind(this);
    this.handleToggleNavRequest = this.handleToggleNavRequest.bind(this);

    this.state = {};
  }

  render() {
    const {isLoaded} = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <DocumentTitle title="Prof. Sylve">
          {isLoaded ? this.renderLayout() : this.renderSplash()}
        </DocumentTitle>
      </MuiThemeProvider>
    );
  }

  renderSplash() {
    return (
      <div className="Splash">
        <CircularProgress size={2}/>
      </div>
    );
  }

  renderLayout() {
    const {locale, signedIn} = this.props;
    const {formatMessage} = this.props.intl;

    let menu;
    let navItems;

    if (signedIn) {
      const currentRoute = this.props.location.pathname;

      navItems = (
        <Menu value={currentRoute}>
          <MenuItem value="/" onTouchTap={this.handleToggleNav} leftIcon={<ViewModuleIcon/>} containerElement={<Link to="/" />}>{formatMessage(messages.byBox)}</MenuItem>
          <MenuItem value="/list" onTouchTap={this.handleToggleNav} leftIcon={<ListIcon/>} containerElement={<Link to="/list" />}>{formatMessage(messages.byList)}</MenuItem>
          <Divider/>
        </Menu>
      );

      menu = (
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIconIcon/></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText={formatMessage(messages.settings)} leftIcon={<SettingsIcon/>} containerElement={<Link to="/settings" />}/>
          <Divider/>
          <MenuItem primaryText={formatMessage(messages.signout)} leftIcon={<PowerSettingsNewIcon/>} containerElement={<Link to="/signout" />}/>
        </IconMenu>
      );
    }

    return (
      <div className="prof-sylve">
        <AppBar
          title={formatMessage(messages.app)}
          onLeftIconButtonTouchTap={this.handleToggleNav}
          iconElementRight={menu}
          style={styles.appbar}
        />
        <Drawer
          docked={false}
          open={this.state.navOpen}
          onRequestChange={this.handleToggleNavRequest}
        >
          <div style={styles.nav}></div>
          {navItems}
          <Menu value={locale}>
            <MenuItem value="en" leftIcon={<LanguageIcon/>} onTouchTap={this.handleChangeLocale.bind(this, 'en')}>English</MenuItem>
            <MenuItem value="fr" leftIcon={<LanguageIcon/>} onTouchTap={this.handleChangeLocale.bind(this, 'fr')}>Français</MenuItem>
            <Divider/>
            <MenuItem leftIcon={<BugReportIcon/>} href="https://github.com/carab/Prof-Sylve" target="blank">{formatMessage(messages.bugs)}</MenuItem>
          </Menu>
        </Drawer>
        <div className="prof-sylve__content">
          {this.props.children}
        </div>
      </div>
    );
  }

  handleChangeLocale(locale) {
    this.props.onLocaleChanged(locale);
  }

  handleToggleNavRequest(open) {
    this.setState({ navOpen: open });
  }

  handleToggleNav() {
    this.setState({ navOpen: !this.state.navOpen })
  }
}

AppComponent.displayName = 'AppComponent';
AppComponent.contextTypes = {
  router: () => { return React.PropTypes.func.isRequired; },
};

const mapStateToProps = (state) => {
  return {
    isLoaded: state.user.isLoaded,
    signedIn: state.user.signedIn,
    locale: state.user.data.profile.locale,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLocaleChanged: (locale) => {
      dispatch(actions.setUserLocale(locale));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent));
