// --- SQL DATA MODULE ---
// Static LeetCode SQL problem data organized by category and topic
// This file contains only data - no logic

import { ProblemDef } from '../types';

export interface SQLCategory {
    id: string;
    title: string;
    icon: string;
    topics: SQLTopic[];
}

export interface SQLTopic {
    id: string;
    name: string;
    patterns: SQLPattern[];
}

export interface SQLPattern {
    name: string;
    description?: string;
    problems: ProblemDef[];
}

export const SQL_DATA: SQLCategory[] = [
    // Category 1: SQL Basics
    {
        id: 'sql-basics',
        title: 'SQL Basics',
        icon: 'database',
        topics: [
            {
                id: 'select-fundamentals',
                name: 'SELECT Fundamentals',
                patterns: [
                    {
                        name: 'Basic SELECT with WHERE',
                        description: 'Retrieve specific columns with filtering conditions',
                        problems: [
                            {
                                id: 'sql-175',
                                name: 'Combine Two Tables',
                                url: 'https://leetcode.com/problems/combine-two-tables/',
                            },
                            {
                                id: 'sql-181',
                                name: 'Employees Earning More Than Their Managers',
                                url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/',
                            },
                            {
                                id: 'sql-182',
                                name: 'Duplicate Emails',
                                url: 'https://leetcode.com/problems/duplicate-emails/',
                            },
                            {
                                id: 'sql-183',
                                name: 'Customers Who Never Order',
                                url: 'https://leetcode.com/problems/customers-who-never-order/',
                            },
                        ],
                    },
                    {
                        name: 'DISTINCT and Ordering',
                        description: 'Remove duplicates and sort results',
                        problems: [
                            {
                                id: 'sql-196',
                                name: 'Delete Duplicate Emails',
                                url: 'https://leetcode.com/problems/delete-duplicate-emails/',
                            },
                            {
                                id: 'sql-584',
                                name: 'Find Customer Referee',
                                url: 'https://leetcode.com/problems/find-customer-referee/',
                            },
                            {
                                id: 'sql-586',
                                name: 'Customer Placing the Largest Number of Orders',
                                url: 'https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'limit-pagination',
                name: 'LIMIT and Pagination',
                patterns: [
                    {
                        name: 'Top N Records',
                        description: 'Retrieve top/bottom N records',
                        problems: [
                            {
                                id: 'sql-176',
                                name: 'Second Highest Salary',
                                url: 'https://leetcode.com/problems/second-highest-salary/',
                            },
                            {
                                id: 'sql-177',
                                name: 'Nth Highest Salary',
                                url: 'https://leetcode.com/problems/nth-highest-salary/',
                            },
                            {
                                id: 'sql-585',
                                name: 'Investments in 2016',
                                url: 'https://leetcode.com/problems/investments-in-2016/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 2: JOIN Patterns
    {
        id: 'sql-joins',
        title: 'SQL Joins',
        icon: 'git-merge',
        topics: [
            {
                id: 'inner-join',
                name: 'INNER JOIN',
                patterns: [
                    {
                        name: 'Basic INNER JOIN',
                        description: 'Match records from two tables',
                        problems: [
                            {
                                id: 'sql-175',
                                name: 'Combine Two Tables',
                                url: 'https://leetcode.com/problems/combine-two-tables/',
                            },
                            {
                                id: 'sql-181',
                                name: 'Employees Earning More Than Their Managers',
                                url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/',
                            },
                            {
                                id: 'sql-262',
                                name: 'Trips and Users',
                                url: 'https://leetcode.com/problems/trips-and-users/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'outer-join',
                name: 'OUTER JOIN',
                patterns: [
                    {
                        name: 'LEFT and RIGHT JOIN',
                        description: 'Include non-matching records',
                        problems: [
                            {
                                id: 'sql-175',
                                name: 'Combine Two Tables',
                                url: 'https://leetcode.com/problems/combine-two-tables/',
                            },
                            {
                                id: 'sql-184',
                                name: 'Department Highest Salary',
                                url: 'https://leetcode.com/problems/department-highest-salary/',
                            },
                            {
                                id: 'sql-185',
                                name: 'Department Top Three Salaries',
                                url: 'https://leetcode.com/problems/department-top-three-salaries/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'self-join',
                name: 'SELF JOIN',
                patterns: [
                    {
                        name: 'Join Table with Itself',
                        description: 'Compare records within same table',
                        problems: [
                            {
                                id: 'sql-181',
                                name: 'Employees Earning More Than Their Managers',
                                url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/',
                            },
                            {
                                id: 'sql-197',
                                name: 'Rising Temperature',
                                url: 'https://leetcode.com/problems/rising-temperature/',
                            },
                            {
                                id: 'sql-603',
                                name: 'Consecutive Available Seats',
                                url: 'https://leetcode.com/problems/consecutive-available-seats/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'multiple-joins',
                name: 'Multiple Table Joins',
                patterns: [
                    {
                        name: 'Joining 3+ Tables',
                        description: 'Complex multi-table relationships',
                        problems: [
                            {
                                id: 'sql-602',
                                name: 'Friend Requests II',
                                url: 'https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/',
                            },
                            {
                                id: 'sql-608',
                                name: 'Tree Node',
                                url: 'https://leetcode.com/problems/tree-node/',
                            },
                            {
                                id: 'sql-1098',
                                name: 'Unpopular Books',
                                url: 'https://leetcode.com/problems/unpopular-books/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 3: Aggregation
    {
        id: 'sql-aggregation',
        title: 'SQL Aggregation',
        icon: 'bar-chart-2',
        topics: [
            {
                id: 'group-by',
                name: 'GROUP BY Fundamentals',
                patterns: [
                    {
                        name: 'Basic GROUP BY',
                        description: 'Group records and aggregate',
                        problems: [
                            {
                                id: 'sql-182',
                                name: 'Duplicate Emails',
                                url: 'https://leetcode.com/problems/duplicate-emails/',
                            },
                            {
                                id: 'sql-511',
                                name: 'Game Play Analysis I',
                                url: 'https://leetcode.com/problems/game-play-analysis-i/',
                            },
                            {
                                id: 'sql-534',
                                name: 'Game Play Analysis III',
                                url: 'https://leetcode.com/problems/game-play-analysis-iii/',
                            },
                            {
                                id: 'sql-585',
                                name: 'Investments in 2016',
                                url: 'https://leetcode.com/problems/investments-in-2016/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'aggregate-functions',
                name: 'Aggregate Functions',
                patterns: [
                    {
                        name: 'COUNT, SUM, AVG, MIN, MAX',
                        description: 'Statistical aggregations',
                        problems: [
                            {
                                id: 'sql-511',
                                name: 'Game Play Analysis I',
                                url: 'https://leetcode.com/problems/game-play-analysis-i/',
                            },
                            {
                                id: 'sql-550',
                                name: 'Game Play Analysis IV',
                                url: 'https://leetcode.com/problems/game-play-analysis-iv/',
                            },
                            {
                                id: 'sql-1070',
                                name: 'Product Sales Analysis IV',
                                url: 'https://leetcode.com/problems/product-sales-analysis-iv/',
                            },
                            {
                                id: 'sql-1077',
                                name: 'Project Employees III',
                                url: 'https://leetcode.com/problems/project-employees-iii/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'having-clause',
                name: 'HAVING Clause',
                patterns: [
                    {
                        name: 'Filter After Aggregation',
                        description: 'Filter grouped results',
                        problems: [
                            {
                                id: 'sql-586',
                                name: 'Customer Placing the Largest Number of Orders',
                                url: 'https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/',
                            },
                            {
                                id: 'sql-1045',
                                name: 'Customers Who Bought All Products',
                                url: 'https://leetcode.com/problems/customers-who-bought-all-products/',
                            },
                            {
                                id: 'sql-1077',
                                name: 'Project Employees III',
                                url: 'https://leetcode.com/problems/project-employees-iii/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 4: Subqueries
    {
        id: 'sql-subqueries',
        title: 'SQL Subqueries',
        icon: 'layers',
        topics: [
            {
                id: 'scalar-subqueries',
                name: 'Scalar Subqueries',
                patterns: [
                    {
                        name: 'Single Value Subqueries',
                        description: 'Subqueries returning single value',
                        problems: [
                            {
                                id: 'sql-176',
                                name: 'Second Highest Salary',
                                url: 'https://leetcode.com/problems/second-highest-salary/',
                            },
                            {
                                id: 'sql-177',
                                name: 'Nth Highest Salary',
                                url: 'https://leetcode.com/problems/nth-highest-salary/',
                            },
                            {
                                id: 'sql-184',
                                name: 'Department Highest Salary',
                                url: 'https://leetcode.com/problems/department-highest-salary/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'correlated-subqueries',
                name: 'Correlated Subqueries',
                patterns: [
                    {
                        name: 'Row-by-Row Subqueries',
                        description: 'Subqueries dependent on outer query',
                        problems: [
                            {
                                id: 'sql-185',
                                name: 'Department Top Three Salaries',
                                url: 'https://leetcode.com/problems/department-top-three-salaries/',
                            },
                            {
                                id: 'sql-262',
                                name: 'Trips and Users',
                                url: 'https://leetcode.com/problems/trips-and-users/',
                            },
                            {
                                id: 'sql-601',
                                name: 'Human Traffic of Stadium',
                                url: 'https://leetcode.com/problems/human-traffic-of-stadium/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'in-exists',
                name: 'IN and EXISTS',
                patterns: [
                    {
                        name: 'Membership Testing',
                        description: 'Check if value exists in set',
                        problems: [
                            {
                                id: 'sql-183',
                                name: 'Customers Who Never Order',
                                url: 'https://leetcode.com/problems/customers-who-never-order/',
                            },
                            {
                                id: 'sql-1045',
                                name: 'Customers Who Bought All Products',
                                url: 'https://leetcode.com/problems/customers-who-bought-all-products/',
                            },
                            {
                                id: 'sql-1079',
                                name: 'Letter Tile Possibilities',
                                url: 'https://leetcode.com/problems/letter-tile-possibilities/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 5: Window Functions
    {
        id: 'sql-window-functions',
        title: 'SQL Window Functions',
        icon: 'layout-grid',
        topics: [
            {
                id: 'row-number-rank',
                name: 'ROW_NUMBER and RANK',
                patterns: [
                    {
                        name: 'Ranking Functions',
                        description: 'Assign ranks to rows',
                        problems: [
                            {
                                id: 'sql-176',
                                name: 'Second Highest Salary',
                                url: 'https://leetcode.com/problems/second-highest-salary/',
                            },
                            {
                                id: 'sql-177',
                                name: 'Nth Highest Salary',
                                url: 'https://leetcode.com/problems/nth-highest-salary/',
                            },
                            {
                                id: 'sql-185',
                                name: 'Department Top Three Salaries',
                                url: 'https://leetcode.com/problems/department-top-three-salaries/',
                            },
                            {
                                id: 'sql-534',
                                name: 'Game Play Analysis III',
                                url: 'https://leetcode.com/problems/game-play-analysis-iii/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'lead-lag',
                name: 'LEAD and LAG',
                patterns: [
                    {
                        name: 'Access Adjacent Rows',
                        description: 'Compare with previous/next rows',
                        problems: [
                            {
                                id: 'sql-197',
                                name: 'Rising Temperature',
                                url: 'https://leetcode.com/problems/rising-temperature/',
                            },
                            {
                                id: 'sql-1225',
                                name: 'Report Contiguous Dates',
                                url: 'https://leetcode.com/problems/report-contiguous-dates/',
                            },
                            {
                                id: 'sql-1454',
                                name: 'Active Users',
                                url: 'https://leetcode.com/problems/active-users/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'running-totals',
                name: 'Running Totals',
                patterns: [
                    {
                        name: 'Cumulative Aggregations',
                        description: 'SUM with OVER clause',
                        problems: [
                            {
                                id: 'sql-534',
                                name: 'Game Play Analysis III',
                                url: 'https://leetcode.com/problems/game-play-analysis-iii/',
                            },
                            {
                                id: 'sql-1204',
                                name: 'Last Person to Fit in the Bus',
                                url: 'https://leetcode.com/problems/last-person-to-fit-in-the-bus/',
                            },
                            {
                                id: 'sql-1321',
                                name: 'Restaurant Growth',
                                url: 'https://leetcode.com/problems/restaurant-growth/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 6: CTEs
    {
        id: 'sql-cte',
        title: 'SQL CTEs',
        icon: 'git-branch',
        topics: [
            {
                id: 'basic-cte',
                name: 'Basic CTEs',
                patterns: [
                    {
                        name: 'Non-Recursive CTEs',
                        description: 'Named temporary result sets',
                        problems: [
                            {
                                id: 'sql-184',
                                name: 'Department Highest Salary',
                                url: 'https://leetcode.com/problems/department-highest-salary/',
                            },
                            {
                                id: 'sql-185',
                                name: 'Department Top Three Salaries',
                                url: 'https://leetcode.com/problems/department-top-three-salaries/',
                            },
                            {
                                id: 'sql-512',
                                name: 'Game Play Analysis II',
                                url: 'https://leetcode.com/problems/game-play-analysis-ii/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'recursive-cte',
                name: 'Recursive CTEs',
                patterns: [
                    {
                        name: 'Hierarchical Data Traversal',
                        description: 'Traverse tree/graph structures',
                        problems: [
                            {
                                id: 'sql-608',
                                name: 'Tree Node',
                                url: 'https://leetcode.com/problems/tree-node/',
                            },
                            {
                                id: 'sql-1098',
                                name: 'Unpopular Books',
                                url: 'https://leetcode.com/problems/unpopular-books/',
                            },
                            {
                                id: 'sql-1270',
                                name: 'All People Report to the Given Manager',
                                url: 'https://leetcode.com/problems/all-people-report-to-the-given-manager/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 7: Set Operations
    {
        id: 'sql-set-operations',
        title: 'SQL Set Operations',
        icon: 'layers',
        topics: [
            {
                id: 'union-operations',
                name: 'UNION and UNION ALL',
                patterns: [
                    {
                        name: 'Combine Result Sets',
                        description: 'Merge rows from multiple queries',
                        problems: [
                            {
                                id: 'sql-602',
                                name: 'Friend Requests II',
                                url: 'https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/',
                            },
                            {
                                id: 'sql-1251',
                                name: 'Average Selling Price',
                                url: 'https://leetcode.com/problems/average-selling-price/',
                            },
                            {
                                id: 'sql-1341',
                                name: 'Movie Rating',
                                url: 'https://leetcode.com/problems/movie-rating/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'intersect-except',
                name: 'INTERSECT and EXCEPT',
                patterns: [
                    {
                        name: 'Set Comparison',
                        description: 'Find common/different records',
                        problems: [
                            {
                                id: 'sql-1050',
                                name: 'Actors and Directors Who Cooperated At Least Three Times',
                                url: 'https://leetcode.com/problems/actors-and-directors-who-cooperated-at-least-three-times/',
                            },
                            {
                                id: 'sql-1132',
                                name: 'Reported Posts II',
                                url: 'https://leetcode.com/problems/reported-posts-ii/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 8: String Manipulation
    {
        id: 'sql-strings',
        title: 'SQL String Functions',
        icon: 'type',
        topics: [
            {
                id: 'pattern-matching',
                name: 'Pattern Matching',
                patterns: [
                    {
                        name: 'LIKE and Wildcards',
                        description: 'Search with patterns',
                        problems: [
                            {
                                id: 'sql-1517',
                                name: 'Find Users With Valid E-Mails',
                                url: 'https://leetcode.com/problems/find-users-with-valid-e-mails/',
                            },
                            {
                                id: 'sql-1527',
                                name: 'Patients With a Condition',
                                url: 'https://leetcode.com/problems/patients-with-a-condition/',
                            },
                            {
                                id: 'sql-1667',
                                name: 'Fix Names in a Table',
                                url: 'https://leetcode.com/problems/fix-names-in-a-table/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'string-functions',
                name: 'String Functions',
                patterns: [
                    {
                        name: 'CONCAT, SUBSTRING, LENGTH',
                        description: 'Manipulate string data',
                        problems: [
                            {
                                id: 'sql-1484',
                                name: 'Group Sold Products By The Date',
                                url: 'https://leetcode.com/problems/group-sold-products-by-the-date/',
                            },
                            {
                                id: 'sql-1667',
                                name: 'Fix Names in a Table',
                                url: 'https://leetcode.com/problems/fix-names-in-a-table/',
                            },
                            {
                                id: 'sql-1683',
                                name: 'Invalid Tweets',
                                url: 'https://leetcode.com/problems/invalid-tweets/',
                            },
                            {
                                id: 'sql-1873',
                                name: 'Calculate Special Bonus',
                                url: 'https://leetcode.com/problems/calculate-special-bonus/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 9: Date/Time Functions
    {
        id: 'sql-datetime',
        title: 'SQL Date/Time',
        icon: 'calendar',
        topics: [
            {
                id: 'date-functions',
                name: 'Date Functions',
                patterns: [
                    {
                        name: 'Date Arithmetic and Extraction',
                        description: 'Manipulate date/time data',
                        problems: [
                            {
                                id: 'sql-511',
                                name: 'Game Play Analysis I',
                                url: 'https://leetcode.com/problems/game-play-analysis-i/',
                            },
                            {
                                id: 'sql-512',
                                name: 'Game Play Analysis II',
                                url: 'https://leetcode.com/problems/game-play-analysis-ii/',
                            },
                            {
                                id: 'sql-550',
                                name: 'Game Play Analysis IV',
                                url: 'https://leetcode.com/problems/game-play-analysis-iv/',
                            },
                            {
                                id: 'sql-1225',
                                name: 'Report Contiguous Dates',
                                url: 'https://leetcode.com/problems/report-contiguous-dates/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'date-gaps',
                name: 'Date Gaps and Ranges',
                patterns: [
                    {
                        name: 'Find Missing Dates',
                        description: 'Identify date gaps in sequences',
                        problems: [
                            {
                                id: 'sql-1225',
                                name: 'Report Contiguous Dates',
                                url: 'https://leetcode.com/problems/report-contiguous-dates/',
                            },
                            {
                                id: 'sql-1454',
                                name: 'Active Users',
                                url: 'https://leetcode.com/problems/active-users/',
                            },
                            {
                                id: 'sql-1459',
                                name: 'Rectangles Area',
                                url: 'https://leetcode.com/problems/rectangles-area/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 10: Conditional Logic
    {
        id: 'sql-conditional',
        title: 'SQL Conditional Logic',
        icon: 'git-pull-request',
        topics: [
            {
                id: 'case-expressions',
                name: 'CASE Expressions',
                patterns: [
                    {
                        name: 'Simple and Searched CASE',
                        description: 'Conditional value selection',
                        problems: [
                            {
                                id: 'sql-608',
                                name: 'Tree Node',
                                url: 'https://leetcode.com/problems/tree-node/',
                            },
                            {
                                id: 'sql-626',
                                name: 'Exchange Seats',
                                url: 'https://leetcode.com/problems/exchange-seats/',
                            },
                            {
                                id: 'sql-1398',
                                name: 'Customers Who Bought Products A and B but Not C',
                                url: 'https://leetcode.com/problems/customers-who-bought-products-a-and-b-but-not-c/',
                            },
                            {
                                id: 'sql-1873',
                                name: 'Calculate Special Bonus',
                                url: 'https://leetcode.com/problems/calculate-special-bonus/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'coalesce-null',
                name: 'COALESCE and NULL Handling',
                patterns: [
                    {
                        name: 'NULL Value Management',
                        description: 'Handle NULL values gracefully',
                        problems: [
                            {
                                id: 'sql-175',
                                name: 'Combine Two Tables',
                                url: 'https://leetcode.com/problems/combine-two-tables/',
                            },
                            {
                                id: 'sql-585',
                                name: 'Investments in 2016',
                                url: 'https://leetcode.com/problems/investments-in-2016/',
                            },
                            {
                                id: 'sql-1098',
                                name: 'Unpopular Books',
                                url: 'https://leetcode.com/problems/unpopular-books/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 11: Data Modification
    {
        id: 'sql-dml',
        title: 'SQL Data Modification',
        icon: 'edit-3',
        topics: [
            {
                id: 'insert-select',
                name: 'INSERT with SELECT',
                patterns: [
                    {
                        name: 'Insert from Query Results',
                        description: 'Insert data based on queries',
                        problems: [
                            {
                                id: 'sql-1949',
                                name: 'Strong Friendship',
                                url: 'https://leetcode.com/problems/strong-friendship/',
                            },
                            {
                                id: 'sql-1919',
                                name: 'Leetcodify Similar Friends',
                                url: 'https://leetcode.com/problems/leetcodify-similar-friends/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'update-delete',
                name: 'UPDATE and DELETE',
                patterns: [
                    {
                        name: 'Modify with JOINs',
                        description: 'Update/delete with complex conditions',
                        problems: [
                            {
                                id: 'sql-196',
                                name: 'Delete Duplicate Emails',
                                url: 'https://leetcode.com/problems/delete-duplicate-emails/',
                            },
                            {
                                id: 'sql-627',
                                name: 'Swap Salary',
                                url: 'https://leetcode.com/problems/swap-salary/',
                            },
                            {
                                id: 'sql-1321',
                                name: 'Restaurant Growth',
                                url: 'https://leetcode.com/problems/restaurant-growth/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 12: Advanced Patterns
    {
        id: 'sql-advanced',
        title: 'SQL Advanced Patterns',
        icon: 'cpu',
        topics: [
            {
                id: 'pivot-unpivot',
                name: 'Pivot and Unpivot',
                patterns: [
                    {
                        name: 'Rows to Columns',
                        description: 'Transform data orientation',
                        problems: [
                            {
                                id: 'sql-1179',
                                name: 'Reformat Department Table',
                                url: 'https://leetcode.com/problems/reformat-department-table/',
                            },
                            {
                                id: 'sql-1484',
                                name: 'Group Sold Products By The Date',
                                url: 'https://leetcode.com/problems/group-sold-products-by-the-date/',
                            },
                            {
                                id: 'sql-1693',
                                name: 'Daily Leads and Partners',
                                url: 'https://leetcode.com/problems/daily-leads-and-partners/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'gaps-islands',
                name: 'Gaps and Islands',
                patterns: [
                    {
                        name: 'Consecutive Ranges',
                        description: 'Find consecutive sequences',
                        problems: [
                            {
                                id: 'sql-601',
                                name: 'Human Traffic of Stadium',
                                url: 'https://leetcode.com/problems/human-traffic-of-stadium/',
                            },
                            {
                                id: 'sql-1225',
                                name: 'Report Contiguous Dates',
                                url: 'https://leetcode.com/problems/report-contiguous-dates/',
                            },
                            {
                                id: 'sql-1454',
                                name: 'Active Users',
                                url: 'https://leetcode.com/problems/active-users/',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'top-n-per-group',
                name: 'Top N Per Group',
                patterns: [
                    {
                        name: 'Select Best N from Each Group',
                        description: 'Row number with partition',
                        problems: [
                            {
                                id: 'sql-185',
                                name: 'Department Top Three Salaries',
                                url: 'https://leetcode.com/problems/department-top-three-salaries/',
                            },
                            {
                                id: 'sql-602',
                                name: 'Friend Requests II',
                                url: 'https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/',
                            },
                            {
                                id: 'sql-1077',
                                name: 'Project Employees III',
                                url: 'https://leetcode.com/problems/project-employees-iii/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 13: Performance
    {
        id: 'sql-performance',
        title: 'SQL Performance',
        icon: 'zap',
        topics: [
            {
                id: 'query-optimization',
                name: 'Query Optimization',
                patterns: [
                    {
                        name: 'Efficient Query Writing',
                        description: 'Optimize query performance',
                        problems: [
                            {
                                id: 'sql-602',
                                name: 'Friend Requests II',
                                url: 'https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/',
                            },
                            {
                                id: 'sql-1045',
                                name: 'Customers Who Bought All Products',
                                url: 'https://leetcode.com/problems/customers-who-bought-all-products/',
                            },
                            {
                                id: 'sql-1205',
                                name: 'Monthly Transactions II',
                                url: 'https://leetcode.com/problems/monthly-transactions-ii/',
                            },
                        ],
                    },
                ],
            },
        ],
    },

    // Category 14: Database Design
    {
        id: 'sql-design',
        title: 'SQL Database Design',
        icon: 'box',
        topics: [
            {
                id: 'referential-integrity',
                name: 'Referential Integrity',
                patterns: [
                    {
                        name: 'Foreign Keys and Constraints',
                        description: 'Maintain data consistency',
                        problems: [
                            {
                                id: 'sql-1280',
                                name: 'Students and Sandwiches',
                                url: 'https://leetcode.com/problems/students-and-sandwiches/',
                            },
                            {
                                id: 'sql-1341',
                                name: 'Movie Rating',
                                url: 'https://leetcode.com/problems/movie-rating/',
                            },
                            {
                                id: 'sql-1378',
                                name: 'Replace Employee ID With The Unique Identifier',
                                url: 'https://leetcode.com/problems/replace-employee-id-with-the-unique-identifier/',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

// Total number of unique SQL problems
export const TOTAL_UNIQUE_SQL_PROBLEMS = (() => {
    const uniqueIds = new Set<string>();
    SQL_DATA.forEach((category) => {
        category.topics.forEach((topic) => {
            topic.patterns.forEach((pattern) => {
                pattern.problems.forEach((problem) => {
                    uniqueIds.add(problem.id);
                });
            });
        });
    });
    return uniqueIds.size;
})();

// Helper function to get all unique SQL problems flattened
export function getAllSQLProblems(): ProblemDef[] {
    const uniqueProblems = new Map<string, ProblemDef>();
    SQL_DATA.forEach((category) => {
        category.topics.forEach((topic) => {
            topic.patterns.forEach((pattern) => {
                pattern.problems.forEach((problem) => {
                    if (!uniqueProblems.has(problem.id)) {
                        uniqueProblems.set(problem.id, problem);
                    }
                });
            });
        });
    });
    return Array.from(uniqueProblems.values());
}

// Helper function to find SQL category by ID
export function getSQLCategoryById(id: string): SQLCategory | undefined {
    return SQL_DATA.find((cat) => cat.id === id);
}

// Helper function to flatten SQL data for easy access (returns unique problems only)
export function flattenSQLData(): Array<{
    category: SQLCategory;
    topic: SQLTopic;
    pattern: SQLPattern;
    problem: ProblemDef;
}> {
    const flattened: Array<{
        category: SQLCategory;
        topic: SQLTopic;
        pattern: SQLPattern;
        problem: ProblemDef;
    }> = [];
    const seenIds = new Set<string>();

    SQL_DATA.forEach((category) => {
        category.topics.forEach((topic) => {
            topic.patterns.forEach((pattern) => {
                pattern.problems.forEach((problem) => {
                    if (!seenIds.has(problem.id)) {
                        seenIds.add(problem.id);
                        flattened.push({ category, topic, pattern, problem });
                    }
                });
            });
        });
    });

    return flattened;
}
