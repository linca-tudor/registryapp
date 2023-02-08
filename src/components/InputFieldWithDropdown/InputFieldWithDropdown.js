import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput as RNTextInput,
  Text,
  Platform,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import getStyles from './InputFieldWithDropdown.styles';
import Colors from '~/helpers/Colors';
import difference from 'lodash.difference';

const HobbiesInputWithIcon = ({placeholder, data, selected, addItem}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [crossIconPosition, setCrossIconPosition] = useState('center');
  const styles = getStyles(crossIconPosition);

  useEffect(() => {
    const filterData = query => {
      const result = difference(data, selected);

      if (!query) {
        return result;
      }

      const formattedInput = query.toLowerCase().replace(/\s+/g, '');

      const filteredResult = result.filter(element => {
        return element
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(formattedInput);
      });

      return filteredResult;
    };

    setFilteredData(filterData(inputText).slice(0, 5));
  }, [inputText, data, selected]);

  useEffect(() => {
    if (filteredData.length > 0 && isFocused) {
      openDropdown();
    } else {
      closeDropdown();
    }
  }, [isFocused, filteredData]);

  useEffect(() => {
    if (selected.length > 0) {
      setCrossIconPosition('bottom');
    } else {
      setCrossIconPosition('center');
    }
  }, [selected]);

  const openDropdown = () => {
    setIsVisible(true);
  };

  const closeDropdown = () => {
    setIsVisible(false);
  };

  const createHobby = () => {
    addItem(inputText);
    setInputText('');
  };

  const renderDropDown = () => {
    return (
      <View style={styles.dropdownContainer}>
        <View style={styles.dropdownTopCover} />
        <View style={styles.dropdownContentContainer}>
          {filteredData.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  addItem(item);
                }}
                key={index}>
                <Text style={[styles.itemText]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderCrossIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setInputText('');
        }}
        style={styles.crossIcon}>
        <Entypo
          name="circle-with-cross"
          size={24}
          color={Colors.ultramarineBlue}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inputContainer}>
        <RNTextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.starDust}
          value={inputText}
          style={styles.input}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onChangeText={txt => {
            setInputText(txt);
          }}
          onSubmitEditing={createHobby}
        />
        {inputText && renderCrossIcon()}
      </View>
      <TouchableOpacity onPress={closeDropdown}>
        {isVisible && renderDropDown()}
      </TouchableOpacity>
    </View>
  );
};

export default HobbiesInputWithIcon;
