class NoDirectoryError extends Error {}
class NoRepositoriesError extends Error {}
class NoAnyRemoteBranchesError extends Error {}

module.exports = {
    NoDirectoryError,
    NoAnyRemoteBranchesError,
    NoRepositoriesError
};
