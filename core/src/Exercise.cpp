/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

#include "pch.h"

#include "Utf8.h"
#include "Exercise.h"

namespace Core
{
    Exercise::Exercise(
        std::string name,
        std::chrono::seconds timeout,
        std::vector<std::string> problems,
        std::vector<std::string> answers,
        std::vector<std::string> solution
    )
        : m_id(std::hash<std::string>{}(name))
        , m_name(std::move(name))
        , m_timeout(timeout)
        , m_problems(std::move(problems))
        , m_answers(std::move(answers))
        , m_solution(std::move(solution))
    {
    }

    Exercise::Exercise(const boost::json::object& json)
    {
        FromJson(json);
    }

    uint64_t Exercise::GetId() const
    {
        return m_id;
    }

    const std::string& Exercise::GetName() const
    {
        return m_name;
    }

    std::chrono::seconds Exercise::GetTimeout() const
    {
        return m_timeout;
    }

    const std::vector<std::string>& Exercise::GetProblems() const
    {
        return m_problems;
    }

    const std::vector<std::string>& Exercise::GetAnswers() const
    {
        return m_answers;
    }

    const std::vector<std::string>& Exercise::GetSolution() const
    {
        return m_solution;
    }

    boost::json::object Exercise::ToJson() const
    {
        boost::json::object json;
        boost::json::array problems;
        boost::json::array answers;
        boost::json::array solution;

        for (const auto& problem : m_problems)
        {
            problems.push_back(boost::json::value(problem));
        }

        for (const auto& answer : m_answers)
        {
            answers.push_back(boost::json::value(answer));
        }

        for (const auto& sol : m_solution)
        {
            solution.push_back(boost::json::value(sol));
        }

        json["id"] = m_id;
        json["name"] = m_name;
        json["timeout"] = static_cast<int64_t>(m_timeout.count());
        json["problems"] = std::move(problems);
        json["answers"] = std::move(answers);
        json["solution"] = std::move(solution);

        return json;
    }

    void Exercise::FromJson(const boost::json::object& json)
    {
        const boost::json::array& problemsJson = json.at("problems").as_array();
        const boost::json::array& answersJson = json.at("answers").as_array();
        const boost::json::array& solutionJson = json.at("solution").as_array();

        m_name = json.at("name").as_string().c_str();

        // cannot use .as_uin64 right now becasue of js JSON.stringify serializes id as int64
        // TODO: find beeter solution
        m_id = std::hash<std::string>{}(m_name);

        m_timeout = std::chrono::seconds{ json.at("timeout").as_int64() };

        m_problems.reserve(problemsJson.size());
        m_answers.reserve(answersJson.size());
        m_solution.reserve(solutionJson.size());

        for (const auto& problemJson : problemsJson)
        {
            m_problems.push_back(problemJson.as_string().c_str());
        }

        for (const auto& answerJson : answersJson)
        {
            m_answers.push_back(answerJson.as_string().c_str());
        }

        for (const auto& solutionJson : solutionJson)
        {
            m_solution.push_back(solutionJson.as_string().c_str());
        }
    }
}
