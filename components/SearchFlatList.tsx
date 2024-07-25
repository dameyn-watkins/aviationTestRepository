import React from 'react';
import {FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link} from "expo-router";
import {openBrowserAsync} from "expo-web-browser";
import {FilterValues, ItemDataCast} from "@/components/FilterJSONFile";


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
    if (itemFilters != undefined) {
        const Ele = () => <><div>Hello {name} </div></>;
        const ItemTest = ({item}: ItemProps) => (
            <Text numberOfLines={1} style={[styles.itemDate]}>Published by {item.source} on: {dateToString(item.alertedDate)}</Text>
        );
        const alertItem = <ItemAlert filterAlert={itemFilters.filterAlert} filterEntity={itemFilters.filterAlert} filterSource={itemFilters.filterAlert}/>
        return <TouchableOpacity onPress={onPress} style={[styles.item]}>
            <Text numberOfLines={1} style={[styles.title]}>{item.title}</Text>
            itemTest
        </TouchableOpacity>
    }
}
const Item = ({item, onPress ,itemFilters}: ItemProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
        <Text numberOfLines={1} style={[styles.title]}>{item.title}</Text>
    </TouchableOpacity>
);

const ItemSubtitle = ({item}: ItemProps) => (
    <Text numberOfLines={1} style={[styles.itemDate]}>Published by {item.source} on: {dateToString(item.alertedDate)}</Text>
);

function ItemAlert ({filterEntity, filterSource, filterAlert}: FilterValues) {
    if (filterAlert != undefined) {
        return <Text numberOfLines={1} style={[styles.itemHighlight]}>Alert {filterSource}</Text>
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
                <Item
                    item={item}
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
        color: 'white',
        fontSize: 11,
        padding: 2,
        textAlign: 'right',
        paddingRight: 6
    },
    itemHighlight: {
        color: 'purple',
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