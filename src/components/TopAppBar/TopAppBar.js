import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LanguageIcon from '@material-ui/icons/Language';
import GitHub from '@material-ui/icons/GitHub';
import Tooltip from '@material-ui/core/Tooltip';
import { FormattedMessage } from 'react-intl';
import { Menu, MenuItem } from '@material-ui/core';
import { allMessages } from '../../locales/languages';

class TopAppBar extends Component {
  constructor(props) {
    super(props);
    this.state = { version: '', anchorEl: null };
  }

  componentDidMount() {
    fetch('/api/v1/tcversion')
      .then((res) => res.json())
      .then((ret) => {
        this.setState({ version: `v${ret.version}` });
      })
      .catch((error) => {
        this.setState({ version: '' });
      });
  }

  handleOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (lang, locale) => {
    if (lang && lang !== locale) {
      const { changeLanguage } = this.props;
      changeLanguage(lang);
    }
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, locale, changeLanguage, ...other } = this.props;
    const { version, anchorEl } = this.state;

    return (
      <div className={classes.root}>
        {/* <AppBar position="static" color="default" {...other} className={classes.appbar}> */}
        <AppBar {...other} position='static' color='primary'>
          <Toolbar className={classes.toolbar}>
            <Typography variant='h6' color='inherit'>
              TasmoCompiler {version} - mod firmware lite by bovirus
            </Typography>

            <div className={classes.toolbarRight}>
              <Tooltip title={<FormattedMessage id='headerProjectGithubPageTooltip' />}>
                <div className={classes.projectPageContainer}>
                  <a href='https://github.com/benzino77/tasmocompiler' target='_blank' rel='noopener noreferrer'>
                    <GitHub className={classes.projectPageImg} />
                  </a>
                </div>
              </Tooltip>
              <div
                className={classes.language}
                role='button'
                tabIndex={0}
                aria-controls='langs-menu'
                aria-haspopup='true'
                onClick={this.handleOpen}
                onKeyPress={this.handleOpen}
              >
                <Typography color='inherit' className={classes.language}>
                  {allMessages[locale].nativeName}
                  <LanguageIcon className={classes.rightIcon} />
                </Typography>
              </div>
            </div>
            <Menu
              className={classes.languageList}
              id='langs-menu'
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => this.handleClose()}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {Object.keys(allMessages)
                .sort()
                .map((lang) => {
                  return (
                    <MenuItem onClick={() => this.handleClose(lang, locale)} key={lang} selected={locale === lang}>
                      <img src={allMessages[lang].flag} alt='' className={classes.flagIcon} />
                      <div className={classes.languageName}>{allMessages[lang].nativeName}</div>
                    </MenuItem>
                  );
                })}
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopAppBar.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.object]).isRequired,
  locale: PropTypes.string.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};

export default TopAppBar;
