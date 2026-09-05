import clsx from "clsx";
import { Fragment } from "react";

type Props = {
  items: {
    id: string | number;
    title: string;
    description: string;
  }[];
};

export const DescriptionList = ({ items }: Props) => {
  return (
    <dl className="grid grid-cols-[auto_1fr] items-center">
      {items.map(({ id, title, description }, index) => (
        <Fragment key={id}>
          <dt
            className={clsx(
              "text-sm text-gray-500 py-2 max-w-40",
              index % 2 === 0 ? "bg-white" : "bg-gray-50",
            )}
          >
            {title}
          </dt>
          <dd
            className={clsx(
              "text-primary font-bold pl-5 py-2",
              index % 2 === 0 ? "bg-white" : "bg-gray-50",
            )}
          >
            {description}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
};
