import dayjs from "dayjs";

const checkIsPastEvent = (event: any) => {
  return dayjs().isAfter(dayjs(event?.startTime));
};

export default checkIsPastEvent;
