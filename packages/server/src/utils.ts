const mapReplacer = (key: string, value: any) => {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }
  return value;
};

export { mapReplacer };
