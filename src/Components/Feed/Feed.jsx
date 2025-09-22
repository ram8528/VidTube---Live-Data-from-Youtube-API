import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";

function Feed({ category, searchTerm = "" }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      if (searchTerm.trim() !== "") {
        const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(
          searchTerm
        )}&type=video&key=${API_KEY}`;

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        const videoIds = searchData.items
          .map((item) => item.id.videoId)
          .filter(Boolean)
          .join(",");

        if (!videoIds) return setData([]);

        const detailUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;

        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();

        setData(detailData.items || []);
      } else {
        const videoListURL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

        const res = await fetch(videoListURL);
        const data = await res.json();
        setData(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setData([]);
    }

    // await fetch(videoListURL)
    //   .then((response) => response.json())
    //   .then((data) => setData(data.items));
  };

  useEffect(() => {
    fetchData();
  }, [category, searchTerm]);

  return (
    <div className="feed">
      {data.map((item, index) => {
        return (
          <Link
            to={`video/${item.snippet.categoryId}/${item.id}`}
            key={index}
            className="card"
          >
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <h2>{item.snippet.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>
              {value_converter(item.statistics.viewCount)} views ;{" "}
              {moment(item.snippet.publishedAt).fromNow()}
            </p>
          </Link>
        );
      })}

      {/* <div className="card">
        <img src={thumbnail8} alt="" />
        <h2>
          Best channel to learn coding that help you to become a web developer
        </h2>
        <h3>Coding Stars</h3>
        <p>15K views ; 2Days ago</p>
      </div> */}
    </div>
  );
}

export default Feed;
