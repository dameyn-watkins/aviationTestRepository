import aviationJson from "@/assets/AviationData.json";

export interface FilterValues{
    filterAlert: string | undefined;
    filterEntity: string | undefined;
    filterSource: string | undefined;
}

export interface ItemDataCast {
    alertedDate: string;
    date?: string;
    documentId: string;
    feedback?: never[];
    feedbackState: string;
    libraryId: string;
    source: string;
    title: string;
    url: string;
    sentences: {
        alertTypes: string[];
        confidenceScore: number;
        entityHighlights: string[];
        position: number;
        relatedEntities: string[];
        text: string;
    }[];
}

export interface SentenceData {
    alertTypes: string[];
    confidenceScore: number;
    entityHighlights: string[];
    position: number;
    relatedEntities: string[];
    text: string;
}

export interface UniqueFilterValues {
    entities: string[];
    alerts: string[];
    sources: string[];
}

/*
converts JSON file into ItemDataCast for use in the program
 */
export function initData (): ItemDataCast[]  {
    let avList: ItemDataCast[] =[];
    aviationJson.documents.forEach(item => {
        let sentenceArray: SentenceData[] = [];
        item.sentences.forEach(sentence => {
            sentenceArray.push(sentence as SentenceData);
        })
        let itemDataCast: ItemDataCast = {
            alertedDate: item.alertedDate,
            date: item.date!= null ? item.date : undefined,
            documentId: item.documentId,
            feedbackState: item.feedbackState,
            libraryId: item.libraryId,
            source: item.source,
            title: item.title,
            url: item.url,
            sentences: sentenceArray,
        }
        avList.push(itemDataCast);
    })
    return avList;
}

/*
    gets all unique names for filtering from article sources, alerts and entities
 */
export function GetUniqueFields(data: ItemDataCast[]) {
    let uniqueSources: string[] = [];
    let uniqueEntities: string[] = [];
    let uniqueAlerts: string[] = [];

    data.forEach( (item) => {
        if(!uniqueSources.includes(item.source)){
            uniqueSources.push(item.source);
        }
        item.sentences?.forEach((childItem) => {
            childItem.entityHighlights?.forEach((entity) => {
                if(!uniqueEntities.includes(entity)){
                    uniqueEntities.push(entity);
                }
            });
            childItem.relatedEntities.forEach((related) => {
                if(!uniqueEntities.includes(related)){
                    uniqueEntities.push(related);
                }
            });
            childItem.alertTypes.forEach((alert) => {
                if(!uniqueEntities.includes(alert)){
                    uniqueAlerts.push(alert);
                }
            });
        });
    });

    let uniqueFilterValues: UniqueFilterValues = {
        entities: uniqueEntities,
        alerts: uniqueAlerts,
        sources: uniqueSources,
    };
    return uniqueFilterValues;
}

/*
    filters based on source, entities and alerts only showing matching articles
 */
export function FilterJSONFile(unfilteredData: ItemDataCast[], filters: FilterValues): ItemDataCast[] {
    let filteredData = unfilteredData;

    if (filters.filterSource !== undefined){
        let source = filters.filterSource;
        filteredData = filteredData.filter(itemData => itemData.source.includes(source));
    }

    if (filters.filterEntity !== undefined){
        let entity = filters.filterEntity;
        filteredData = filteredData.filter(item => item.sentences.some(sentences => {
            //checks if the entity is mentioned in highlights or related entities
            return (sentences.entityHighlights.includes(entity)) || (sentences.relatedEntities.includes(entity));
        }));
    }

    if (filters.filterAlert !== undefined){
        let alert = filters.filterAlert;
        filteredData = filteredData.filter(item => item.sentences.some(sentences => {
            //checks if the entity is mentioned in highlights or related entities
            return (sentences.alertTypes.includes(alert));
        }));
    }

    return filteredData;
}

export function sortJSONFile(aviationData: ItemDataCast[]) {

}


