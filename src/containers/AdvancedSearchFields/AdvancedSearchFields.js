/* eslint-disable arrow-body-style */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import axios from 'axios';
import qs from 'qs';
import PropTypes from 'prop-types';
import Button from '../../components/UI/Button/Button';
import SearchFields from '../../components/UI/SearchFields/SearchFields';
import Strip from '../../assets/strip.png';
import './AdvancedSearchFields.css';
import * as actions from '../../actions';

const menuitems = {
  main: [
    {
      name: 'Gender',
      type: 'chooseOne',
      options: ['male', 'female', 'another'],
    },
    {
      name: 'Age',
      type: 'input',
      inputType: 'number',
    },
    {
      name: 'Countries',
      type: 'search',
    },
    {
      name: 'City',
      type: 'input',
      inputType: 'text',
    },
    {
      name: 'Relationship',
      type: 'chooseOne',
      options: ['single', 'maried', 'have'],
    },
  ],
  activity: [
    {
      name: 'Education',
      type: 'chooseOne',
      options: ['School', 'PhD', 'Univercitydegree', 'College'],
    },
    {
      name: 'Languages',
      type: 'chooseMany',
      options: ['English', 'Russian', 'German', 'French', 'Chinese', 'Ukrainian'],
    },
    {
      name: 'Interests',
      type: 'chooseMany',
      options: ['football', 'pets', 'guitar', 'travel', 'videogames'],
    },
    {
      name: 'Smoking',
      type: 'chooseOne',
      options: ['no', 'sometimes', 'smoke'],
    },
    {
      name: 'Workas',
      type: 'chooseOne',
      options: ['businessman', 'programmer', 'engineer', 'designer', 'teacher', 'policeman'],
    },
  ],
  appearance: [
    {
      name: 'Height',
      type: 'input',
      inputType: 'number',
    },
    {
      name: 'Weight',
      type: 'input',
      inputType: 'number',
    },
    {
      name: 'Bodytype',
      type: 'chooseOne',
      options: ['thick', 'normal', 'thin', 'sport'],
    },
    {
      name: 'Eyes',
      type: 'chooseOne',
      options: ['grey', 'brown', 'green', 'blue'],
    },
    {
      name: 'Hair',
      type: 'chooseOne',
      options: ['long', 'bold', 'verylong', 'normal'],
    },
  ],
};

const formatDate = (date) => {
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;
  const yy = date.getFullYear();
  return `${yy}-${mm}-${dd}`;
};

class AdvancedSearchFields extends Component {
  state = {
    activeMenu: 'main',
    parameters: {
      gender: '',
      age: { from: '', to: '' },
      countries: '',
      city: '',
      relationship: '',
      education: '',
      languages: [],
      interests: [],
      smoking: '',
      workas: '',
      height: { from: '', to: '' },
      weight: { from: '', to: '' },
      bodytype: '',
      eyes: '',
      hair: '',
    },
    new: false,
    menu: {
      languages: false,
      interestss: false,
    },
    search: {
      countries: {
        value: '',
        results: [],
      },
    },
  }

  componentDidMount() {
    if (this.props.mapSearchParameters.users.length > 0) {
      const { parameters } = this.state;
      if (this.props.mapSearchParameters.parameters.genderMain.value === 'mapSearch.woman') {
        parameters.gender = 'female';
      } else {
        parameters.gender = 'male';
      }
      parameters.age = {
        from: this.props.mapSearchParameters.parameters.from.value,
        to: this.props.mapSearchParameters.parameters.to.value,
      };
      this.setState({
        parameters,
      });
    }
  }

  menuClick = (menuItem) => () => {
    this.setState({ activeMenu: menuItem });
  }

  itemClick = (menuItem) => () => {
    this.setState((prevState) => {
      const oldmenu = { ...prevState.menu };
      oldmenu[menuItem] = !oldmenu[menuItem];
      return { menu: oldmenu };
    });
  }

  fieldChange = (item, value, index) => (e) => {
    const oldParameters = { ...this.state.parameters };
    const oldSearch = { ...this.state.search };
    const name = item.name.toLowerCase();
    if (item.type === 'chooseMany') {
      if (oldParameters[name].includes(value)) {
        oldParameters[name] = oldParameters[name].filter((el) => el !== value);
      } else {
        oldParameters[name].push(value);
      }
    } else if (item.inputType === 'number') {
      oldParameters[name][index] = e.target.value;
    } else if (item.type === 'search') {
      oldParameters[name] = value.country_id;
      oldSearch[name].value = value.title;
      oldSearch[name].results = [];
    } else {
      oldParameters[name] = e.target.value;
    }
    this.setState({ parameters: oldParameters, search: oldSearch });
  }

  searchChangeHandler = (item) => (e) => {
    e.preventDefault();
    const input = e.target.value;
    const data = { input, lng: this.props.lng.short, type: item };
    const old = { ...this.state.search };
    axios({
      method: 'post',
      url: './searchprofile',
      data: qs.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
      },
    }).then((res) => {
      old[item].results = res.data.countries;
      old[item].value = input;
      this.setState({ search: old });
    }).catch((err) => {
      this.props.addError(err.response.data.message);
    });
  }

  menuItemsRender = (activeMenu) => (<ul className="advanced_search__search__navigation">
  {Object.keys(menuitems).map((item) => {
    const buttonClasses = ['advanced_search__search__navigation__item__a', activeMenu === item ? 'advanced_search__search__navigation__item__a--active' : ''];
    return (<li className="advanced_search__search__navigation__item" key={item}>
      <a className={buttonClasses.join(' ')} onClick={this.menuClick(item)}>
        <Trans>userPage.{item}.title</Trans>
      </a>
    </li>);
  })}
</ul>);

  newChange = () => {
    this.setState((prevState) => {
      return { new: !prevState.new };
    });
  }

  searchFildsRender = (activeMenu) => (<div className="advanced_search__search__filds">
     {this.props.type === 'map'
       ? menuitems[activeMenu].filter((el) => el.name !== 'Gender' && el.name !== 'Age' && el.name !== 'City' && el.name !== 'Countries')
         .map((item) => <SearchFields
            key={item.name}
            item={item}
            activeMenu={this.state.activeMenu}
            onChange={this.fieldChange}
            value={this.state.parameters[item.name.toLowerCase()]}
            openOptions = {this.openOptions}
            menu={this.state.menu}
            itemClick ={this.itemClick}
            searchChangeHandler={this.searchChangeHandler}
            search={this.state.search}
            lng={this.props.lng.short}
      />)
       : menuitems[activeMenu].map((item) => <SearchFields
            key={item.name}
            item={item}
            activeMenu={this.state.activeMenu}
            onChange={this.fieldChange}
            value={this.state.parameters[item.name.toLowerCase()]}
            openOptions = {this.openOptions}
            menu={this.state.menu}
            itemClick ={this.itemClick}
            searchChangeHandler={this.searchChangeHandler}
            search={this.state.search}
            lng={this.props.lng.short}
        />)
     }
  </div>);

  search = (e) => {
    e.preventDefault();
    const oldParameters = { ...this.state.parameters };
    const keys = Object.keys(oldParameters);
    const parametersArray = [];
    for (let i = 0; i < keys.length; i += 1) {
      if (oldParameters[keys[i]] === '') {
        delete oldParameters[keys[i]];
      } else if (oldParameters[keys[i]].length === 0) {
        delete oldParameters[keys[i]];
      } else if (oldParameters[keys[i]].from === '' && oldParameters[keys[i]].to === '') {
        delete oldParameters[keys[i]];
      } else if (keys[i] === 'age' && oldParameters[keys[i]].from !== '') {
        const birthadayfrom = new Date(Date.now());
        birthadayfrom.setFullYear(birthadayfrom.getFullYear() - oldParameters[keys[i]].from);
        const formatedFrom = formatDate(birthadayfrom);
        parametersArray.push(`birthday <= "${formatedFrom}"`);
        if (oldParameters.age.to !== '') {
          const birthadayto = new Date(Date.now());
          birthadayfrom.setFullYear(birthadayto.getFullYear() - oldParameters[keys[i]].to);
          const formatedto = formatDate(birthadayfrom);
          parametersArray.push(`birthday >= "${formatedto}"`);
        }
      } else if (keys[i] === 'countries') {
        parametersArray.push(`country_id = "${oldParameters[keys[i]]}"`);
      } else if (typeof oldParameters[keys[i]] === 'string') {
        parametersArray.push(`${keys[i]} = "${oldParameters[keys[i]]}"`);
      } else if (oldParameters[keys[i]].length > 0) {
        const elements = oldParameters[keys[i]].map((el) => `${keys[i]} LIKE '%${el}%'`);
        parametersArray.push(elements.join(' AND '));
      } else if (oldParameters[keys[i]].from !== '') {
        parametersArray.push(`${keys[i]} >= "${oldParameters[keys[i]].from}"`);
        if (oldParameters[keys[i]].to !== '') {
          parametersArray.push(`${keys[i]} <= "${oldParameters[keys[i]].to}"`);
        }
      } else if (oldParameters[keys[i]].to !== '') {
        parametersArray.push(`${keys[i]} <= "${oldParameters[keys[i]].to}"`);
      }
    }
    if (this.props.type === 'map') {
      if (this.props.mainParameters.searchFrom !== '') {
        const birthadayfrom = new Date(Date.now());
        birthadayfrom.setFullYear(birthadayfrom.getFullYear()
        - this.props.mainParameters.searchFrom);
        const formatedFrom = formatDate(birthadayfrom);
        parametersArray.push(`birthday <= "${formatedFrom}"`);
      }
      if (this.props.mainParameters.searchTo !== '') {
        const birthadayfrom = new Date(Date.now());
        birthadayfrom.setFullYear(birthadayfrom.getFullYear() - this.props.mainParameters.searchTo);
        const formatedto = formatDate(birthadayfrom);
        parametersArray.push(`birthday >= "${formatedto}"`);
      }

      if (this.props.mainParameters.gender === 'mapSearch.man') {
        parametersArray.push('gender = "male"');
      }
      if (this.props.mainParameters.gender === 'mapSearch.woman') {
        parametersArray.push('gender = "female"');
      }

      if (this.props.mainParameters.city !== '') {
        parametersArray.push(`city = "${this.props.mainParameters.city}"`);
      }
      const parameters = parametersArray.join(' AND ');
      const data = {
        parameters,
        distance: this.props.mainParameters.distance,
        lat: this.props.mainParameters.center.lat,
        lng: this.props.mainParameters.center.lng,
      };
      axios({
        method: 'post',
        url: './mapsearch',
        data: qs.stringify(data),
        headers: {
          Authorization: `Bearer ${this.props.user.token}`,
        },
      }).then((res) => {
        this.props.updateMainState({
          users: res.data.users,
          parameters,
          center: this.props.mainParameters.center,
        });
      }).catch((err) => {
        this.props.addError(err.response.data.message);
      });
    } else {
      const parameters = parametersArray.join(' AND ');
      const data = { parameters, page: 1, sort: 'created_at' };
      axios({
        method: 'post',
        url: './advancedsearch',
        data: qs.stringify(data),
        headers: {
          Authorization: `Bearer ${this.props.user.token}`,
        },
      }).then((res) => {
        this.props.updateMainState({
          users: res.data.users,
          activPage: 1,
          paramsForPage: parameters,
          sortType: 'created_at',
          sortDirections: 'ASC',
        });
      }).catch((err) => {
        this.props.addError(err.response.data.message);
      });
    }
  }

  render() {
    return (<React.Fragment>
      <section className="advanced_search">
        <div className="advanced_search__title__container">
          <h3 className="advanced_search__title"><Trans>advancedSearch.searchTitle</Trans></h3>
          <img src={Strip} alt=""></img>
        </div>
        <div className="advanced_search__search">
          <form>
            {this.menuItemsRender(this.state.activeMenu)}
            {this.searchFildsRender(this.state.activeMenu)}
            <div className="advanced_search__search__button">
              <input type="checkbox" id="new" className="advanced_search__search__checkbox" checked={this.state.new} onChange={this.newChange}/>
              <label htmlFor="new" className="advanced_search__search__button__text"><Trans>advancedSearch.onlyNew</Trans></label>
              <Button type = {'submit'} classes={'redButton'} clicked={this.search}>advancedSearch.search</Button>
            </div>
          </form>
        </div>
      </section>
    </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
    lng: state.lng,
    mapSearchParameters: state.mapSearchParameters,
  };
  return props;
};

const actionCreators = {
  addError: actions.addError,
};

AdvancedSearchFields.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    token: PropTypes.string,
  }),
  lng: PropTypes.shape({
    short: PropTypes.string,
  }),
  updateMainState: PropTypes.func,
  users: PropTypes.array,
  type: PropTypes.string,
  mainParameters: PropTypes.shape(),
  center: PropTypes.shape(),
  mapSearchParameters: PropTypes.shape(),
  addError: PropTypes.func,
};

export default connect(mapStateToProps, actionCreators)(AdvancedSearchFields);
