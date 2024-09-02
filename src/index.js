import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import { db } from './config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { registerLicense } from '@syncfusion/ej2-base';
import styles from "./App.css";

registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cXGJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXZecnRQRWNZWEdxWUo=');

const App = () => {
    const [scheduleData, setScheduleData] = useState([]);

    const fetchEvents = async () => {
        try {
            const eventsCollection = collection(db, "events");
            const eventsSnapshot = await getDocs(eventsCollection);
            const eventsList = eventsSnapshot.docs.map(doc => ({
                Id: doc.id,
                Subject: doc.data().Subject,
                StartTime: doc.data().StartTime.toDate(),
                EndTime: doc.data().EndTime.toDate(),
                IsAllDay: doc.data().IsAllDay,
                Status: doc.data().Status,
                Priority: doc.data().Priority
            }));
            setScheduleData(eventsList);
        } catch (error) {
            console.error("Error fetching events: ", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const onEventAdded = async (args) => {
        try {
            const eventData = Array.isArray(args.data) ? args.data[0] : args.data;
            const { Subject, StartTime, EndTime, IsAllDay, Status, Priority } = eventData;

            if (Subject && StartTime && EndTime) {
                await addDoc(collection(db, "events"), {
                    Subject,
                    StartTime,
                    EndTime,
                    IsAllDay: IsAllDay || false,
                    Status: Status || 'Pending',
                    Priority: Priority || 'Normal'
                });
                fetchEvents();
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const onEventDeleted = async (args) => {
        try {
            const eventData = Array.isArray(args.data) ? args.data : [args.data];
            for (const event of eventData) {
                await deleteDoc(doc(db, "events", event.Id));
            }
            fetchEvents();
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    return (
        <div>
            <h2>Scheduler App</h2>
        <ScheduleComponent
            height='95vh'
            selectedDate={new Date(2024, 0, 1)}
            eventSettings={{ dataSource: scheduleData }}
            actionComplete={(args) => {
                if (args.requestType === 'eventCreated') onEventAdded(args);
                if (args.requestType === 'eventRemoved') onEventDeleted(args);
            }}
        >
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
        </ScheduleComponent>
        </div>
    );
};

createRoot(document.getElementById('schedule')).render(<App />);
