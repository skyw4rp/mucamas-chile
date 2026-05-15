export type BookingPayload = {
  serviceType: string;
  date: string;
  time: string;
  comuna: string;
  address: string;
  duration: string;
  fullName: string;
  phone: string;
  email: string;
  comments: string;
};

export type BookingFieldKey = keyof BookingPayload;

export type BookingFieldErrors = Partial<Record<BookingFieldKey, string[]>>;

export type BookingSuccessResponse = {
  ok: true;
  message: string;
};

export type BookingErrorResponse = {
  ok: false;
  errors?: BookingFieldErrors;
  message?: string;
};

export type BookingApiResponse = BookingSuccessResponse | BookingErrorResponse;
