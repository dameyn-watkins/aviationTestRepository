import Ionicons from '@expo/vector-icons/Ionicons';
import {Button, ImageBackground, StyleSheet, View} from 'react-native';

import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import React, {useEffect, useState} from "react";
import {SearchFlatList} from "@/components/SearchFlatList";
import {
    FilterJSONFile,
    FilterValues,
    GetUniqueFields,
    initData,
    ItemDataCast
} from "@/components/FilterJSONFile";
import {STR_CONST} from "@/constants/strings";
import {Colors} from "@/constants/Colors";

const initialData = initData();
const uniqueFields = GetUniqueFields(initialData);

export default function SearchScreen() {
  const [filters, setFilters] = useState<FilterValues>();
  const [avData, setAvData] = useState<ItemDataCast[]>(initialData);

    useEffect(() => {
        console.log("unique Alerts: " + uniqueFields.alerts);
        if (filters === undefined){
            setAvData(initialData);
        } else {
            setAvData(FilterJSONFile(initialData, filters));
        }
    }, [filters]);

  /*
    handles the click events for filters
   */
  function handleFilterClick(filterName: string, filterValue: string) {
      let source = filters?.filterSource;
      let entity = filters?.filterEntity;
      let alert = filters?.filterAlert;

      // if same value is selected disable filter. otherwise change to new value
      if(filterName === STR_CONST.source){
          source = filterValue === source ? undefined : filterValue;
      }
      if(filterName === STR_CONST.entity){
          entity = filterValue === entity ? undefined : filterValue;
      }
      if(filterName === STR_CONST.alert){
          alert = filterValue === alert ? undefined : filterValue;
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
    <View>
        <ImageBackground
            style={styles.header}
            resizeMode="center"
            source={require("../../assets/images/splash.png")}
        />
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" >found {avData.length} results</ThemedText>
        </ThemedView>
      <Button
          onPress={() => {
            handleFilterClick(STR_CONST.source, 'Wash');
          }}
          title={'filter by source'}
      />
      <Button
          onPress={() => {
            handleFilterClick(STR_CONST.entity, 'Q7240-Lockheed Martin');
          }}
          title={'filter by entity'}
      />
      <Button
          onPress={() => {
            handleFilterClick(STR_CONST.alert, 'Materials and Manufacturing (Aviation)');
          }}
          title={'filter by alert types'}
      />
      <SearchFlatList data={avData}/>
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
        height: 150,
        overflow: 'hidden',
        backgroundColor: 'lightblue',
    },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingTop: 10,
    backgroundColor: 'lightblue',
  },
});

