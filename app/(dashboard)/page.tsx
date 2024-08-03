"use client";
import React from 'react';
import { DatePicker } from '@/components/date-picker';
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";

/* export default function Home() {
  const { onOpen}= useNewAccount();
  return (
    <div>
      <Button onClick={onOpen}>
        Add an account
      </Button>
    </div>
  );
} */

const TestDatePicker = () => {
  const [date, setDate] = React.useState<Date>();

  return (
    <div style={{ padding: '20px' }}>
      <DatePicker
        value={date}
        onChange={setDate}
        disabled={false}
      />
    </div>
  );
};
export default TestDatePicker;
