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


#ifndef EXERCISE_H
#define EXERCISE_H

#include <vector>
#include <string>
#include <filesystem>
#include <chrono>
#include <boost/json.hpp>

namespace Core
{
    inline const std::filesystem::path EXERCISES_DIR = std::filesystem::current_path() / "exercises";

    class Exercise final
    {
    public:
        Exercise(
            std::string name,
            std::chrono::seconds timeout,
            std::vector<std::string> problems,
            std::vector<std::string> answers);

        Exercise(const std::filesystem::path& path) noexcept(false);

        boost::json::object ToJson() const;
        const std::string& GetName() const noexcept;
        std::chrono::seconds GetTimeout() const noexcept;
        const std::vector<std::string>& GetProblems() const noexcept;
        const std::vector<std::string>& GetAnswers() const noexcept;

        void SaveAsCSV(const std::filesystem::path& destDir) const noexcept(false);
        void LoadFromCSV(const std::filesystem::path& filePath) noexcept(false);

    private:
        std::string m_name;
        std::chrono::seconds m_timeout;
        std::vector<std::string> m_problems;
        std::vector<std::string> m_answers;
    };
}

#endif
