import React, {useEffect, useState} from 'react';
import {FlatList, Platform, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import {Link} from "expo-router";
import {openBrowserAsync} from "expo-web-browser";
import {FilterJSONFile, FilterValues, ItemDataCast} from "@/components/FilterJSONFile";


type ListProps = {
    data: Array<any>;
    filters?: FilterValues;
};

function dateToString(listDate: string){
    const date = new Date(listDate);
    return date.toLocaleString('en-UK');
}

type ItemProps = {
    item: ItemDataCast;
    itemFilters?: FilterValues;
    isSelected?: boolean;
    onPress?: () => void;
};

function Items ({item, onPress ,itemFilters}: ItemProps) {
    const [showAlert, setShowAlert] = useState(false)
    const [showSource, setShowSource] = useState(false)
    const [showEntity, setShowEntity] = useState(false)

    //displays search highlights if related field is searched
    if (itemFilters != undefined) {
        const isAlert = () => {
            setShowAlert(itemFilters.filterAlert !== undefined)
        }
        const isSource = () => {
            setShowSource(itemFilters.filterSource !== undefined)
        }
        const isEntity = () => {
            setShowEntity(itemFilters.filterEntity !== undefined)
        }

    }
    return <TouchableOpacity onPress={onPress} style={[styles.item]}>
        <Text numberOfLines={1} style={[styles.title]}>{item.title}</Text>
        { true ? <ItemSource item={item}/> : null }
    </TouchableOpacity>
}

const ItemSource = ({item}: ItemProps) => (
    <Text style={[styles.itemDate]}>Published by <Text style={[styles.itemHighlight]}>{item.source}</Text></Text>
);

const ItemSubtitle = ({item}: ItemProps) => (
    <Text numberOfLines={1} style={[styles.itemDate]}>Published by {item.source} on: {dateToString(item.alertedDate)}</Text>
);

function ItemAlert ({item, onPress ,itemFilters}: ItemProps, inheritStyle: StyleProp<TextStyle>) {
    if (itemFilters != undefined) {
        return <Text numberOfLines={1} style={inheritStyle}>Related Alert {itemFilters.filterAlert}</Text>
    }
}

const ItemSelected = ({item, }: ItemProps) => (
    <TouchableOpacity  style={[styles.itemSelected]}>
        <Text style={[styles.titleSelected]}>{item.title}</Text>
        <ItemSubtitle item={item}/>
        <Link
            style={[styles.hrefLink]}
            target="_blank"
            href={item.url}
            onPress={async (event) => {
                if (Platform.OS !== 'web') {
                    // Prevent the default behavior of linking to the default browser on native.
                    event.preventDefault();
                    // Open the link in an in-app browser.
                    await openBrowserAsync(item.url);
                }
            }}
        >
            {item.url}
        </Link>
    </TouchableOpacity>
);

export function SearchFlatList({data, filters}: ListProps){
    const [selectedId, setSelectedId] = React.useState<string>();

    const renderItem = ({item}: {item: ItemDataCast}) => {
        if (item.documentId === selectedId){
            return (
                <ItemSelected item={item}
                              isSelected={selectedId === item.documentId}
                              itemFilters={filters}
                />
            );
        } else {
            return (
                <Items
                    item={item}
                    itemFilters={filters}
                    onPress={() => setSelectedId(item.documentId)}
                />
            );
        }
    };
    return (
        <FlatList
            data={data}
            maxToRenderPerBatch={20}
            renderItem={renderItem}
            keyExtractor={item => item.documentId}
        />
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -35,
        left: -5,
        position: 'absolute',
    },
    hrefLink: {
        color: 'blue',
        fontSize: 10,
        margin: 4
    },
    item: {
        backgroundColor: 'white',
        padding: 2,
        marginVertical: 4,
        marginHorizontal: 4,
    },
    top: {
        flex: 0.3,
        backgroundColor: 'grey',
    },
    itemDate: {
        color: 'black',
        fontSize: 11,
        padding: 2,
        textAlign: 'right',
        paddingRight: 6
    },
    itemHighlight: {
        color: 'black',
        alignSelf: 'flex-start',
        backgroundColor: 'lightblue',
        fontSize: 11,
        padding: 2,
        textAlign: 'right',
        paddingRight: 6
    },
    itemDateSelected: {
        color: 'white',
        fontSize: 11,
        padding: 2,
        textAlign: 'right',
        paddingRight: 6
    },
    itemSelected: {
        flex: 0.3,
        backgroundColor: 'gray',
        borderWidth: 5,
        borderRadius: 3
    },
    title: {
        fontSize: 15,
        color: 'black',
    },
    titleSelected: {
        fontSize: 22,
        color: 'white',
        margin: 6
    },
    titleContainer: {

        gap: 2,
    },
});