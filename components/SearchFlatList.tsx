import React, {useEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, Text,TouchableOpacity, View} from 'react-native';
import {Link} from "expo-router";
import {openBrowserAsync} from "expo-web-browser";
import {
    FilterValues,
    GetFilteredAlert, GetFilteredComments,
    GetFilteredEntity,
    ItemDataCast
} from "@/components/FilterJSONFile";


type ListProps = {
    data: Array<any>;
    filters?: FilterValues;
};

function dateToString(listDate: string){
    const date = new Date(listDate);
    return date.toLocaleString('en-UK');
}

interface UnselectedItem extends ItemProps {
    showAlert: boolean;
    showSource: boolean;
    showEntity: boolean;
}

type ItemProps = {
    item: ItemDataCast;
    itemFilters?: FilterValues;
    isSelected?: boolean;
    onPress?: () => void;
};

/*
    renders unselected items and displays related search filters
 */
function Items ({item, onPress ,itemFilters, showSource, showAlert, showEntity}: UnselectedItem) {
    return <TouchableOpacity onPress={onPress} style={[styles.item]}>
            <Text numberOfLines={1} style={[styles.title]}>{item.title}</Text>
            { showSource ? <ItemSource item={item}/> : null }
            { showAlert ? <ItemAlert item={item} itemFilters={itemFilters}/> : null }
            { showEntity ? <ItemEntity item={item} itemFilters={itemFilters}/> : null }
        </TouchableOpacity>

}

const ItemSource = ({item}: ItemProps) => (
    <Text style={[styles.itemDate]}>Published by <Text style={[styles.itemSource]}>{item.source}</Text></Text>
);

function ItemAlert ({item, itemFilters}: ItemProps) {
    if(!!itemFilters?.filterAlert) {
        return <Text style={[styles.itemDate]}>Tags/Alerts: <Text
            style={[styles.itemAlert]}>{GetFilteredAlert(itemFilters.filterAlert, item.sentences)}</Text></Text>
    }
}

function ItemEntity ({item, itemFilters}: ItemProps) {
    if(!!itemFilters?.filterEntity) {
        return <Text style={[styles.itemDate]}>Related to: <Text
            style={[styles.itemEntity]}>{GetFilteredEntity(itemFilters.filterEntity, item.sentences)}</Text></Text>
    }
}
/*
    creates an array from all comments and returns the value
 */
function ItemComments ({item}: ItemProps) {
    const arrayOfComments = item.sentences.map((sentence) =>
        <Text style={[styles.textSelected]}>
            {GetFilteredComments(sentence).entities} :
            "{GetFilteredComments(sentence).comment}"
            Confidence: {GetFilteredComments(sentence).confidenceScore}
        </Text>
    );
    return <View>{arrayOfComments}</View>
}





const ItemSubtitle = ({item}: ItemProps) => (
    <Text numberOfLines={1} style={[styles.itemDate]}>Published by {item.source} on: {dateToString(item.alertedDate)}</Text>
);

const separator = () => {
    return ( <View style={styles.separator}/> )
}

const ItemSelected = ({item}: ItemProps) => (
    <TouchableOpacity  style={[styles.itemSelected]}>
        <Text style={[styles.titleSelected]}>{item.title}</Text>
        <ItemSubtitle item={item} />
        <ItemComments item={item} />
        <Text style={[styles.textSelected]}>Read Full Article: </Text>
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
    const [showAlert, setShowAlert] = useState(false)
    const [showSource, setShowSource] = useState(false)
    const [showEntity, setShowEntity] = useState(false)

    //displays search highlights if related field is searched
    useEffect(() => {
        if (filters != undefined) {
            setShowAlert(!!filters.filterAlert)
            setShowSource(!!filters.filterSource)
            setShowEntity(!!filters.filterEntity)
        }
    }, [filters]);

    //two renderings for item selected and not selected. should be moved into a separate file and combined
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
                    showAlert={showAlert}
                    showSource={showSource}
                    showEntity={showEntity}
                    onPress={() => setSelectedId(item.documentId)}
                />
            );
        }
    };
    return (
        <FlatList
            data={data}
            maxToRenderPerBatch={20}
            ItemSeparatorComponent={separator}
            renderItem={renderItem}
            keyExtractor={item => item.documentId}
        />
    );
}

const styles = StyleSheet.create({
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
    separator: {
        height: 2,
        backgroundColor: '#828282'
    },
    itemDate: {
        fontSize: 11,
        padding: 2,
        textAlign: 'right',
        paddingRight: 6
    },
    itemSource: {
        color: 'black',
        alignSelf: 'flex-start',
        backgroundColor: '#f2cf6f',
        fontSize: 11,
        padding: 2,
        textAlign: 'right',
        paddingRight: 6
    },
    itemEntity: {
        color: 'black',
        alignSelf: 'flex-start',
        backgroundColor: '#9bf2a6',
        fontSize: 11,
        padding: 2,
        textAlign: 'right',
        paddingRight: 6
    },
    itemAlert: {
        color: 'black',
        alignSelf: 'flex-start',
        backgroundColor: '#f29594',
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
        backgroundColor: '#87aae6',
        borderWidth: 3,
        borderRadius: 1
    },
    title: {
        fontSize: 15,
        color: 'black',
    },
    titleSelected: {
        fontSize: 22,
        textAlign: 'center',
        color: 'white',
        margin: 6
    },
    textSelected: {
        fontSize: 12,
        color: '#3d3d3d',
        margin: 3
    },
    titleContainer: {

        gap: 2,
    },
});