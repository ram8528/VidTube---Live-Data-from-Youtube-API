import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import {
  like,
  dislike,
  share,
  save,
  jack,
} from "../../assets/assets";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

function PlayVideo() {
  const { videoId } = useParams();
  const [apiData, setApiData] = useState(null);

  const [channelData, setChannelData] = useState(null);

  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = async () => {
    // Fetching Videos Data
    const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;

    await fetch(videoDetailsUrl)
      .then((res) => res.json())
      .then((data) => setApiData(data.items[0]));
  };

  //   const fetchOtherData = async () => {
  //     //Fetching Channel Data
  //     const channelDataUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;

  //     await fetchOtherData(channelDataUrl)
  //       .then((res) => res.json())
  //       .then((data) => (setChannelData(data.items[0])));
  //   };

  const fetchOtherData = async () => {
    if (!apiData?.snippet?.channelId) return;

    const channelDataUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;

    const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
    try {
      const res = await fetch(channelDataUrl);
      const data = await res.json();
      setChannelData(data.items[0]);

      await fetch(commentUrl)
        .then((res) => res.json())
        .then((data) => setCommentData(data.items));
      // console.log("Channel Data URL:", channelDataUrl);
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      // console.log("apiData:", apiData); // now will print the actual object
      fetchOtherData();
    }
  }, [apiData]); // ← run ONLY when apiData changes

  //   console.log(channelData.snippet.thumbnails.default.url);

  return (
    <div className="play-video">
      {/* <video src={video} controls autoPlay muted></video> */}

      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : "Latest Video"}</h3>
      <div className="play-video-info">
        <p>
          {apiData
            ? `${value_converter(
                apiData.statistics.viewCount
              )} views • ${moment(apiData.snippet.publishedAt).fromNow()}`
            : "Loading..."}
        </p>

        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : 155}
          </span>
          <span>
            <img src={dislike} alt="" />2
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || jack}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : "Dummy One"}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : "1M"}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 250)
            : "Description here"}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : "3K"}{" "}
          Comments
        </h4>

        {commentData.map((item, index) => {
          return (
            <div key={index} className="comment">
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt=""
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  <span>1 day ago</span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>
                    {value_converter(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayVideo;
