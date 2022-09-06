import { FC, useEffect, useState } from 'react';
import styles from './Countdown.module.scss';

interface CountdownProps {
    until?: Date;
    onEndReached: () => void;
    className?: string;
}

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const Countdown: FC<CountdownProps> = ({ until, onEndReached, className }) => {
    const [remainingDays, setRemainingDays] = useState(0);
    const [remainingHours, setRemainingHours] = useState(0);
    const [remainingMinutes, setRemainingMinutes] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [endReached, setEndReached] = useState(false);

    const calculateRemainingTime = () => {
        const now = new Date();
        if (!until) {
            until = now;
        }

        const timeDiff = until.getTime() - now.getTime();

        const days = Math.floor(timeDiff / day);
        const hours = Math.floor((timeDiff % day) / hour);
        const minutes = Math.floor((timeDiff % hour) / minute);
        const seconds = Math.floor((timeDiff % minute) / second);

        if ((days + hours + minutes + seconds) <= 0) {
            setEndReached(true);

            return;
        }

        if (days != remainingDays) setRemainingDays(days);
        if (hours != remainingHours) setRemainingHours(hours);
        if (minutes != remainingMinutes) setRemainingMinutes(minutes);

        setRemainingSeconds(seconds);
    };

    useEffect(() => {
        if (endReached) {
            onEndReached();
        }
    }, [endReached]);

    useEffect(() => {
        const interval = setInterval(calculateRemainingTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (endReached) {
        return (
            <p className={`${styles.title} ${className}`}>Is Live</p>
        );
    }

    return (
        <p className={`${styles.title} ${className}`}>
            {remainingDays.toLocaleString('en-GB', { minimumIntegerDigits: 2 })}:
            {remainingHours.toLocaleString('en-GB', { minimumIntegerDigits: 2 })}:
            {remainingMinutes.toLocaleString('en-GB', { minimumIntegerDigits: 2 })}:
            {remainingSeconds.toLocaleString('en-GB', { minimumIntegerDigits: 2 })}
        </p>
    );
};

export default Countdown;