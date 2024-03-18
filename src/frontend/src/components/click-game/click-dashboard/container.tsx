import View, { IProps } from '.'
import React, { useEffect } from 'react'
import { faker } from '@faker-js/faker/locale/zh_TW';

const names = new Array(200).fill(0).map(() => faker.person.fullName());
const tableIds = new Array(20).fill(0).map(() => `${faker.person.fullName()}桌`);


export default React.memo(() => {
  const [clickRecords, setClickRecords] = React.useState<IProps['clickRecords']>([]);

  useEffect(() => {
    let i = 0;
    setInterval(() => {
      if (i++ < 10000) {
        setClickRecords((prev) => prev.concat({ name: faker.helpers.arrayElement(names), tableId: faker.helpers.arrayElement(tableIds), clicks: Math.ceil(Math.random() * 2) + 1 }))
      }
    }, 1);
  }, [])

  return <View clickRecords={clickRecords} />
})