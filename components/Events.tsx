"use client";
import type { UseWaitForTransactionReceiptReturnType } from "wagmi";
import React, { useEffect, useState, useCallback } from "react";
import useMultiBaas from "../hooks/useMultiBaas";

interface EventInput {
  name: string;
  type: string;
  value: string;
}

interface EventData {
  event: {
    name: string;
    inputs: EventInput[];
  };
  triggeredAt: string;
  transaction: {
    txHash: string;
  };
}

interface EventsProps {
  txReceipt: UseWaitForTransactionReceiptReturnType['data'] | undefined;
}

const Events: React.FC<EventsProps> = ({ txReceipt }) => {
  const { getVotedEvents } = useMultiBaas();
  const [events, setEvents] = useState<EventData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Wrap fetchEvents with useCallback
  const fetchEvents = useCallback(async () => {
    setIsFetching(true);
    try {
      const fetchedEvents = await getVotedEvents();
      if (fetchedEvents) {
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsFetching(false);
    }
  }, [getVotedEvents]);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events whenever txReceipt changes
  useEffect(() => {
    if (txReceipt) {
      fetchEvents();
    }
  }, [txReceipt, fetchEvents]);

  return (
    <div className="container">
      <h1 className="title">Recent Events</h1>
      <div className="spinner-parent">
        {isFetching && (
          <div className="overlay">
            <div className="spinner"></div>
          </div>
        )}
        {!isFetching && events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul className="events-list">
            {events.map((event, index) => (
              <li key={index} className="event-item">
                <div className="event-name">
                  <strong>{event.event.name}</strong> - {event.triggeredAt}
                </div>
                <div className="event-details">
                  {event.event.inputs.map((input, idx) => (
                    <p key={idx}>
                      <strong>{input.name}:</strong> {input.value}
                    </p>
                  ))}
                  <p>
                    <strong>Transaction Hash:</strong> {event.transaction.txHash}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Events;
