import Stack from './api/stack';
import { useEffect, useState } from 'react';
import { Button, InfiniteScrollTable } from '@contentstack/venus-components';
import FilterOptions from './components/FilterOptions';
function App() {

  const [tableData, setTableData] = useState([]);
  const [tag, setTag] = useState([]);
  const [contentType, setContentType] = useState('');

  //table
  let [data, updateData] = useState([])
  let [itemStatusMap, updateItemStatusMap] = useState({})
  let [loading, updateLoading] = useState(false)
  let [viewBy, updateViewBy] = useState('Comfort')
  let [totalCounts, updateTotalCounts] = useState(0)

  useEffect(() => {
    fetchData();
    
  }, [])

  async function handleSubmit(e : any) {
    e.preventDefault();
    fetchData();
  }


  const fetchData = async () => {

    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
  .then(response => response.json())
  .then(data => console.log(data));
    try {
      let itemStatusMap : Array <Object> = []
      for (let index : number = 0; index <= 30; index++) {
        itemStatusMap[index] = 'loading the data... hang'
      }

      updateItemStatusMap(itemStatusMap)
      updateLoading(true)
      const response = await Stack.getMultipleEntries(contentType, tag);
      let tableData = response.map((entry : any, index : number) => {
        itemStatusMap[index] = 'loaded';
        let entryHREF : string= "https://app.contentstack.com/#!/stack/blt8f285fdea6372037/content-type/" + entry.content_type + "/en-us/entry/" + entry.uid + "/edit"
        return {
          index: index,
          title: <a href={entryHREF}target="_blank">{entry.title}</a>,
          uid: entry.uid,
          content_type: entry.content_type,
          version: entry._version,
          modified_at: entry.updated_at,
        }
      })
      updateData(tableData);
      updateItemStatusMap({ ...itemStatusMap })
      updateLoading(false)
      updateTotalCounts(tableData.length);
    } catch (error) {
      console.log('fetchData -> error', error)
    }
  }

  const columns = [
    {
      Header: "#",
      id: "index",
      accessor: "index",
    },
    {
      Header: 'Title',
      id: 'title',
      accessor: "title",
    },
    {
      Header: 'UID',
      id: "uid",
      accessor: "uid",
    },
    {
      Header: 'Content Type',
      id: 'content_type',
      accessor: "content_type",
    },
    {
      Header: 'Version',
      id: 'version',
      accessor: "version",
    },
    {
      Header: 'Modified At',
      id: 'modified_at',
      accessor: "modified_at",
      cssClass: "ModifiedCell"
    }
  ]


  return (
    <div className="App">
      <div>
        <FilterOptions setTag={setTag} tag={tag} setContentType={setContentType} contentType={contentType} />
        <Button
          buttonType="primary"
          icon="Send"
          onClick={(e : any) => handleSubmit(e)}
        >
          Search
        </Button>
      </div>
      <InfiniteScrollTable
        data={data}
        columns={columns}
        uniqueKey={'uid'}
        fetchTableData={fetchData}
        loading={loading}
        totalCounts={totalCounts}
        name={{ plural: "Entries", singular: "Entry" }}
        itemStatusMap={itemStatusMap}
        columnSelector={false}
        loadMoreItems={() => undefined}
        tableHeight={500}
      />
    </div>
  );
}

export default App;
