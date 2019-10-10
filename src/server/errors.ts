class NoDirectoryError extends Error {}
class NoRepositoriesError extends Error {}
class NoAnyRemoteBranchesError extends Error {}

export {
    NoDirectoryError,
    NoAnyRemoteBranchesError,
    NoRepositoriesError
};
