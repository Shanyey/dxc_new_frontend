import axios from "axios";
import CsvDownloadButton from "react-json-to-csv";
import { useEffect, useState } from "react";

export default function DownloadAzure() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  async function list() {
    setLoading(true);
    const endpoint = "/data-api/rest/Queries/?$orderby=createdAt";
    const response = await axios.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.value);
    setData(response.data.value);
    setLoading(false);
  }
  // on mount fetch data
  useEffect(() => {
    list();
  }, []);

  return (
    <div className="flex content-center justify-center">
      {loading ? (
        <>Getting data from db...</>
      ) : (
        <CsvDownloadButton data={data} />
      )}
    </div>
  );
}
