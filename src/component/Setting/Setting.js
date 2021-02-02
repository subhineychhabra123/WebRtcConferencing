import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup } from 'reactstrap';
import { useForm } from 'react-hook-form';
import Select, { createFilter } from 'react-select';
import moment from 'moment-timezone';

import { getfromLocalStorage, setInLocalStorage } from '../../utils/common';

import { saveUpdateSettings, getSettings } from '../../service/settingService';

const Setting = () => {
  const { errors, handleSubmit, register, setValue } = useForm();

  const [timezones, setTimezones] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedOption, setReactSelect] = useState();
  const dispatch = useDispatch();
  const stableDispatch = useCallback(dispatch, []);
  const settingData = useSelector((state) => state.setting.get('setting'));

  useEffect(() => {
    register({ name: 'timezone' }, { required: true });
  }, [register]);

  useEffect(() => {
    var offsetTimezones = getTimezones();
    const clientTimezone = moment.tz.guess();
    let clientTimezoneValue = settingData.timezone
      ? offsetTimezones.find((x) => x.value === settingData.timezone)
      : offsetTimezones.find((x) => x.value === clientTimezone);

    handleTimezoneSelect(clientTimezoneValue);
    setTimezones(offsetTimezones);
  }, [settingData]);

  useEffect(() => {
    const userDetails = getfromLocalStorage('userDetails');
    setUserDetails(userDetails);
    stableDispatch(getSettings(userDetails.id));
  }, [stableDispatch]);

  const onSubmit = (data) => {
    data.userId = userDetails.id;
    setInLocalStorage('userSetting', data);
    stableDispatch(saveUpdateSettings(data));
  };

  const handleTimezoneSelect = (selectedOption) => {
    const selectedOptionValue = selectedOption.value;
    setValue('timezone', selectedOptionValue);
    setReactSelect(selectedOption);
  };

  const getTimezones = () => {
    var timeZones = moment.tz.names();
    var offsetTimezones = [];

    for (var i in timeZones) {
      const currentTimezone = timeZones[i];
      const label = '(GMT' + moment.tz(currentTimezone).format('Z') + ') ' + currentTimezone;

      offsetTimezones.push({
        value: currentTimezone,
        label,
      });
    }

    return offsetTimezones;
  };

  return (
    <React.Fragment>
      <div className='content'>
        <div className='container-fluid'>
          <h1 className='h3 mb-2 text-gray-800'>Settings</h1>
          <div className='card shadow mb-4'>
            <div className='card-header py-3' style={{ justifyContent: 'flex-end' }}></div>
            <div className='card-body'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='row'>
                  <div className='col-6'>
                    <FormGroup>
                      <label>Timezone </label>

                      <Select
                        isClearable={true}
                        placeholder='Select timezone'
                        noOptionsMessage={() => 'No timezone found'}
                        name='timezone'
                        value={selectedOption}
                        options={timezones}
                        onChange={handleTimezoneSelect}
                        filterOption={createFilter({ ignoreAccents: false })}
                      />
                      {errors.timezone && <span className='custom-error'> Timezone is required</span>}
                    </FormGroup>

                    <button type='submit' className='btn btn-primary'>
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Setting;
