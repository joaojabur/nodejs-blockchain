interface StatusError extends Error {
    status?: number;
};

export default StatusError;