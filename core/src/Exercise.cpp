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
        std::vector<std::string> answers
    )
        : m_id(std::hash<std::string>{}(name))
        , m_name(std::move(name))
        , m_timeout(timeout)
        , m_problems(std::move(problems))
        , m_answers(std::move(answers))
    {
    }

    size_t Exercise::GetId() const noexcept
    {
        return m_id;
    }

    const std::string& Exercise::GetName() const noexcept
    {
        return m_name;
    }

    std::chrono::seconds Exercise::GetTimeout() const noexcept
    {
        return m_timeout;
    }

    Exercise::Exercise(const std::filesystem::path& path) noexcept(false)
    {
        LoadFromCSV(path);
    }

    const std::vector<std::string>& Exercise::GetProblems() const noexcept
    {
        return m_problems;
    }

    const std::vector<std::string>& Exercise::GetAnswers() const noexcept
    {
        return m_answers;
    }

    boost::json::object Exercise::ToJson() const
    {
        boost::json::object json;
        boost::json::array problems;
        boost::json::array answers;

        for (const auto& problem : m_problems)
        {
            problems.push_back(boost::json::value(problem));
        }

        for (const auto& answer : m_answers)
        {
            answers.push_back(boost::json::value(answer));
        }

        json["id"] = m_id;
        json["name"] = m_name;
        json["timeout"] = m_timeout.count();
        json["problems"] = std::move(problems);
        json["answers"] = std::move(answers);

        return json;
    }

    void Exercise::SaveAsCSV(const std::filesystem::path& destDir) const noexcept(false)
    {
        if (!std::filesystem::exists(destDir))
        {
            std::filesystem::create_directory(destDir);
        }

        const std::wstring filename = Encoding::ToWide(m_name) + L".csv";
        const std::filesystem::path path = destDir / filename;

        std::wofstream file(path);
        if (!file.is_open())
        {
            throw std::runtime_error("Failed to open file for writing: " + path.string());
        }

        file << m_id << std::endl;

        long long timeout = m_timeout.count();
        file << timeout << std::endl;

        file << m_problems.size() << std::endl;

        for (const std::string problem : m_problems)
        {
            file << problem.size() << ",";
            file << problem.c_str() << std::endl;
        }

        file << m_answers.size() << std::endl;

        for (const std::string answer : m_answers)
        {
            file << answer.size() << ",";
            file << answer.c_str() << std::endl;
        }

        if (!file.good()) {
            throw std::runtime_error("Error writing to file: " + path.string());
        }
    }

    void Exercise::LoadFromCSV(const std::filesystem::path& filePath) noexcept(false)
    {
        std::ifstream file(filePath);
        if (!file.is_open())
        {
            throw std::runtime_error("Failed to open file for reading: " + filePath.string());
        }

        file >> m_id;

        long long timeout;
        file >> timeout;
        m_timeout = std::chrono::seconds(timeout);

        file.ignore();

        size_t problemsSz = 0;
        file >> problemsSz;
        m_problems.resize(problemsSz);
        file.ignore();

        for (size_t i = 0; i < problemsSz; ++i)
        {
            size_t strLen = 0;
            file >> strLen;
            file.ignore();

            m_problems[i].resize(strLen);
            file.read(m_problems[i].data(), strLen);

            file.ignore();
        }

        size_t size = 0;
        file >> size;
        file.ignore();
        m_answers.resize(size);

        for (size_t i = 0; i < size; ++i)
        {
            size_t answerSize;

            std::string answer;

            file >> answerSize;
            file.ignore();

            answer.resize(answerSize);

            file.read(answer.data(), answerSize);
            file.ignore();

            m_answers[i] = answer;
        }

        const std::wstring name = filePath.filename().replace_extension("").wstring();

        m_name = Encoding::ToUtf8(name);
    }
}
