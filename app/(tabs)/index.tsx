import {
  StyleSheet,
  View,
  ImageBackground, Button, TextInput
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FilterJSONFile, FilterValues, initData, ItemDataCast} from "@/components/FilterJSONFile";
import {STR_CONST} from "@/constants/strings";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {SearchFlatList} from "@/components/SearchFlatList";

const initialData = initData();

export default function HomeScreen() {
  const [filters, setFilters] = useState<FilterValues>();
  const [avData, setAvData] = useState<ItemDataCast[]>(initialData);

  useEffect(() => {
    if (filters === undefined){
      setAvData(initialData);
    } else {
      setAvData(FilterJSONFile(initialData, filters));
    }
  }, [filters]);

  /*
    handles the click events for filters
   */
  function handleFilterUpdate(filterName: string, filterValue: string) {
    let source = filters?.filterSource;
    let entity = filters?.filterEntity;
    let alert = filters?.filterAlert;

    // if same value is selected disable filter. otherwise change to new value
    if(filterName === STR_CONST.source){
      source = filterValue;
    }
    if(filterName === STR_CONST.entity){
      entity = filterValue;
    }
    if(filterName === STR_CONST.alert){
      alert = filterValue;
    }

    let newFilter: FilterValues = {
      filterSource: filterName === STR_CONST.source ? source: filters?.filterSource,
      filterEntity: filterName === STR_CONST.entity ? entity: filters?.filterEntity,
      filterAlert: filterName === STR_CONST.alert ? alert: filters?.filterAlert,
    }

    setFilters(newFilter);

    return

  }

  return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ImageBackground
            style={styles.header}
            resizeMode="center"
            source={require("../../assets/images/splash.png")}
        />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" >found {avData.length} results</ThemedText>
        </ThemedView>
        <TextInput style={styles.inputText} placeholder={"Filter for Publishers"} onChangeText={text => handleFilterUpdate(STR_CONST.source, text) }/>
        <TextInput style={styles.inputText} placeholder={"Filter for Related Companies"} onChangeText={text => handleFilterUpdate(STR_CONST.entity, text) }/>
        <TextInput style={styles.inputText} placeholder={"Filter for Alert Types"} onChangeText={text => handleFilterUpdate(STR_CONST.alert, text) }/>
        <SearchFlatList data={avData} filters={filters}/>
      </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -35,
    left: -5,
    position: 'absolute',
  },
  header: {
    height: 100,
    overflow: 'hidden',
    backgroundColor: 'lightblue',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  inputText: {
    padding: 2,
    marginHorizontal: 2,
    borderWidth: 1,

  },
  title: {
    fontSize: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    color: 'black',
    gap: 4,
    paddingTop: 10,
    backgroundColor: 'lightblue',
  },
});
